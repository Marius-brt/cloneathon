import { getProvider } from "@/lib/config/ai";
import { getSession } from "@/lib/server/auth-utils";
import { models } from "@/lib/server/models";
import { calculateCost } from "@/lib/server/openrouter";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import { getTools, toolsEnum } from "@/lib/server/tools";
import type { Annotation } from "@/lib/types";
import type { OpenRouterProvider } from "@openrouter/ai-sdk-provider";
import {
  type DataStreamWriter,
  type UIMessage,
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText
} from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  chatId: z.string().uuid(),
  tools: z.array(z.enum(toolsEnum)),
  modelId: z.string(),
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
  })
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
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { chatId, message, tools, modelId } = body.data;

    let allowedTools = tools;

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!models[modelId]) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    if (!models[modelId].supports_tools) {
      allowedTools = [];
    }

    let provider: OpenRouterProvider | null = null;

    try {
      provider = await getProvider();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized", code: "key_missing" },
        { status: 401 }
      );
    }

    const chat = await ChatRepository.getOrCreateChat(chatId);

    const msg = await MessageRepository.upsertMessage({
      id: crypto.randomUUID(),
      chatId: chat.id,
      modelId,
      role: message.role,
      content: message.content,
      parts: message.parts,
      annotations: {}
    });

    const previousMessages = await MessageRepository.getAllMessages(chatId);

    const messages = appendClientMessage({
      messages: previousMessages.map((m) => ({ ...m, content: "" }) as UIMessage),
      message: {
        id: msg.id,
        role: msg.role as UIMessage["role"],
        content: msg.content,
        parts: msg.parts as UIMessage["parts"]
      }
    });

    const annotations: Annotation[] = [];

    return createDataStreamResponse({
      execute: async (dataStream) => {
        annotations.push(createAnnotation("model_id", modelId, dataStream));

        const result = streamText({
          model: provider(modelId),
          messages,
          experimental_generateMessageId: () => crypto.randomUUID(),
          system: `
          You are Cloneathon, an ai assistant that can answer questions and help with tasks.
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
          `,
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
                annotations: annotations
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
