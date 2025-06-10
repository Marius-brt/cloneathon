import { model } from "@/lib/config/ai";
import { getSession } from "@/lib/server/auth-utils";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import { getTools } from "@/lib/server/tools";
import {
  type CoreAssistantMessage,
  type CoreToolMessage,
  type Message,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText
} from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

function getTrailingMessageId({
  messages
}: {
  messages: ResponseMessage[];
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) {
    return null;
  }

  return trailingMessage.id;
}

export async function POST(req: Request) {
  try {
    const { chatId, messages, tools } = await req.json();

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let chat = await ChatRepository.getChat(chatId);

    if (!chat) {
      chat = await ChatRepository.createChat(chatId);
    }

    const userMessage = messages
      .filter((message: Message) => message.role === "user")
      .at(-1);

    await MessageRepository.createMessage({
      role: "user",
      parts: userMessage?.parts,
      content: userMessage?.content ?? "",
      chatId: chat.id
    });

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
          messages,
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
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (message) => message.role === "assistant"
                )
              });

              if (!assistantId) {
                throw new Error("No assistant message found!");
              }

              const [, assistantMessage] = appendResponseMessages({
                messages,
                responseMessages: response.messages
              });

              await MessageRepository.createMessage({
                role: assistantMessage.role,
                parts: assistantMessage.parts,
                content: assistantMessage.content,
                createdAt: assistantMessage.createdAt,
                chatId: chat.id
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
