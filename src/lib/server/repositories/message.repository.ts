import { prisma } from "@/lib/config/db";
import type { Message } from "@ai-sdk/react";
import { getSafeSession } from "@/lib/server/auth-utils";

export const MessageRepository = {
  async upsertMessage({
    chatId,
    id,
    role,
    content,
    parts
  }: {
    id: string;
    chatId: string;
    role: string;
    content: string;
    parts: any[];
  }) {
    return await prisma.message.upsert({
      where: { id },
      update: {
        content,
        parts
      },
      create: {
        id,
        chatId,
        content,
        role,
        parts
      }
    });
  },
  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const session = await getSafeSession();
    const messages = await prisma.message.findMany({
      where: {
        chatId,
        chat: {
          userId: session.user.id
        }
      }
    });

    return messages.map((message) => ({
      id: message.id,
      role: message.role as Message["role"],
      parts: message.parts as Message["parts"],
      content: message.content
    })) as Message[];
  }
};
