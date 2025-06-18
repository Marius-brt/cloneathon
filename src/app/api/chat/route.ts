import { getProvider } from "@/lib/config/ai";
import { getSession } from "@/lib/server/auth-utils";
import { models } from "@/lib/server/models";
import { calculateCost } from "@/lib/server/openrouter";
import { AgentRepository } from "@/lib/server/repositories/agent.repository";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import { getTools, toolsEnum } from "@/lib/server/tools";
import type { Annotation } from "@/lib/types";
import type { OpenRouterProvider } from "@openrouter/ai-sdk-provider";
import {
  type Attachment,
  type DataStreamWriter,
  type UIMessage,
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText
} from "ai";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  chatId: z.uuid(),
  tools: z.array(z.enum(toolsEnum)),
  modelId: z.string(),
  agentId: z.uuid().optional(),
  message: z.object({
    content: z.string(),
    role: z.enum(["user"]),
    parts: z
      .array(
        z.object({
          type: z.enum(["text"]),
          text: z.string()
        })
      )
      .min(1)
      .max(1)
  }),
  files: z.array(
    z.object({
      name: z.string(),
      contentType: z.string(),
      url: z.string()
    })
  )
});

function createAnnotation(
  name: string,
  value: string | Record<string, any>,
  dataStream: DataStreamWriter
): Annotation {
  dataStream.writeMessageAnnotation({
    type: name,
    value
  });

  return {
    type: name,
    value
  };
}

export async function POST(req: Request) {
  try {
    const body = bodySchema.safeParse(await req.json());

    if (!body.success) {
      console.error(body.error);
      return NextResponse.json({ error: "invalid_request_body" }, { status: 400 });
    }

    const { chatId, message, tools, modelId, agentId } = body.data;

    let allowedTools = tools;

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const model = models[modelId];

    if (!model) {
      return NextResponse.json({ error: "model_not_found" }, { status: 404 });
    }

    if (!model.supports_tools) {
      allowedTools = [];
    }

    let provider: OpenRouterProvider | null = null;

    try {
      provider = await getProvider();
    } catch {
      return NextResponse.json({ error: "key_missing" }, { status: 401 });
    }

    const chat = await ChatRepository.getOrCreateChat(chatId);

    const msgFiles: Attachment[] = [];
    /* model.input_capabilities.includes("file") ||
      model.input_capabilities.includes("image")
        ? files
        : []; */

    const msg = await MessageRepository.upsertMessage({
      id: crypto.randomUUID(),
      chatId: chat.id,
      modelId,
      role: message.role,
      content: message.content,
      parts: message.parts,
      annotations: {},
      attachments: msgFiles.length > 0 ? msgFiles.map((f) => f.name ?? "") : undefined
    });

    const previousMessages = await MessageRepository.getAllMessages(chatId);

    const messages = appendClientMessage({
      messages: previousMessages.map((m) => ({ ...m, content: "" }) as UIMessage),
      message: {
        id: msg.id,
        role: msg.role as UIMessage["role"],
        experimental_attachments: msgFiles.length > 0 ? msgFiles : undefined,
        content: msg.content,
        parts: msg.parts as UIMessage["parts"]
      }
    });

    const agent = agentId ? await AgentRepository.getAgent(agentId) : null;
    const instructions = agent
      ? `Here are some instructions given by the user:
    ${agent.instructions}`
      : "";

    const annotations: Annotation[] = [];

    return createDataStreamResponse({
      onError: (error: any) => {
        console.error("Stream error", error);
        switch (error.statusCode) {
          case 402:
            return "insufficient_funds";
          case 403:
            return "rate_limit_exceeded";
          default:
            return "internal_server_error";
        }
      },

      execute: async (dataStream) => {
        annotations.push(createAnnotation("model_id", modelId, dataStream));

        const result = streamText({
          model: provider(modelId),
          messages,
          experimental_generateMessageId: () => crypto.randomUUID(),
          system: `You are Cloneathon, an ai assistant that can answer questions and help with tasks.
          Be helpful and provide relevant information
          Be respectful and polite in all interactions.
          Be engaging and maintain a conversational tone.
          Always use LaTeX for mathematical expressions - 
          Inline math must be wrapped in single dollar signs: $content$
          Display math must be wrapped in double dollar signs: $$content$$
          Display math should be placed on its own line, with nothing else on that line.
          Do not nest math delimiters or mix styles.
          Examples:
          - Inline: The equation $E = mc^2$ shows mass-energy equivalence.
          - Display: 
          $$\\frac{d}{dx}\\sin(x) = \\cos(x)$$
          
          ${instructions}`,
          tools: await getTools(allowedTools, dataStream),
          onError: (error) => {
            console.error("error", error);
          },
          onFinish: async ({ response, usage }) => {
            try {
              annotations.push(
                createAnnotation(
                  "usage",
                  {
                    input: usage.promptTokens,
                    output: usage.completionTokens,
                    cost: calculateCost(models[modelId], usage)
                  },
                  dataStream
                )
              );

              const responseMessages = appendResponseMessages({
                messages,
                responseMessages: response.messages
              });

              const newMessage = responseMessages.at(-1);

              if (!newMessage) {
                throw new Error("No response message found!");
              }

              await MessageRepository.upsertMessage({
                modelId,
                id: newMessage.id,
                chatId: chatId,
                role: newMessage.role,
                content: newMessage.content,
                parts: newMessage.parts as any[],
                annotations
              });
            } catch (error) {
              console.error("error", error);
            }
          },
          maxSteps: allowedTools.length > 0 ? 4 : undefined,
          experimental_transform: [smoothStream({ chunking: "word" })]
        });

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
          sendUsage: true,
          sendSources: true
        });
      }
    });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
