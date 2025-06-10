import { prisma } from "@/lib/config/db";
import type { Message } from "@ai-sdk/react";

export const MessageRepository = {
  async createMessage(data: {
    role: string;
    parts: any;
    content: string;
    chatId: string;
    createdAt?: Date;
  }) {
    return await prisma.message.create({
      data
    });
  },
  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: {
        chatId
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
