import { model } from "@/lib/config/ai";
import { getSession } from "@/lib/server/auth-utils";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import { getTools } from "@/lib/server/tools";
import {
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

const bodySchema = z.object({
  chatId: z.string(),
  tools: z.array(z.string()),
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

export async function POST(req: Request) {
  try {
    const body = bodySchema.safeParse(await req.json());

    if (!body.success) {
      console.error("Invalid request body", body.error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { chatId, message, tools } = body.data;

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await ChatRepository.getChat(chatId);

    const msg = await MessageRepository.upsertMessage({
      id: crypto.randomUUID(),
      chatId: chat.id,
      role: message.role,
      content: message.content,
      parts: message.parts
    });

    const previousMessages = await MessageRepository.getMessagesByChatId(chatId);

    const messages = appendClientMessage({
      messages: previousMessages.map((m) => ({ ...m, content: "" }) as UIMessage),
      message: {
        id: msg.id,
        role: msg.role as UIMessage["role"],
        content: msg.content,
        parts: msg.parts as UIMessage["parts"]
      }
    });

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
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
          tools: await getTools(tools, dataStream),
          onError: (error) => {
            console.error("error", error);
          },
          onFinish: async ({ response }) => {
            try {
              const responseMessages = appendResponseMessages({
                messages,
                responseMessages: response.messages
              });

              const newMessage = responseMessages.at(-1);

              if (!newMessage) {
                throw new Error("No response message found!");
              }

              await MessageRepository.upsertMessage({
                id: newMessage.id,
                chatId: chatId,
                role: newMessage.role,
                content: newMessage.content,
                parts: newMessage.parts as any[]
              });
            } catch (error) {
              console.error("error", error);
            }
          },
          maxSteps: 4,
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
