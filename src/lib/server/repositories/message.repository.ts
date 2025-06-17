import { prisma } from "@/lib/config/db";
import { MESSAGES_BATCH_SIZE } from "@/lib/constants";
import { getSafeSession } from "@/lib/server/auth-utils";
import type { Annotation } from "@/lib/types";
import type { Message } from "@ai-sdk/react";

export const MessageRepository = {
  async upsertMessage({
    chatId,
    modelId,
    id,
    role,
    content,
    parts,
    annotations,
    attachments
  }: {
    id: string;
    chatId: string;
    modelId: string;
    role: string;
    content: string;
    parts: any[];
    annotations: any;
    attachments?: string[];
  }) {
    return await prisma.message.upsert({
      where: { id },
      update: {
        content,
        parts,
        annotations
      },
      create: {
        id,
        chatId,
        modelId,
        content,
        role,
        parts,
        annotations,
        attachments
      }
    });
  },
  async getMessagesByChatId(chatId: string, count: number): Promise<Message[]> {
    const session = await getSafeSession();
    const messages = await prisma.message.findMany({
      where: {
        chatId,
        chat: {
          userId: session.user.id
        }
      },
      take: MESSAGES_BATCH_SIZE,
      skip: count,
      orderBy: {
        createdAt: "desc"
      }
    });

    return messages.map((message) => ({
      id: message.id,
      role: message.role as Message["role"],
      parts: message.parts as Message["parts"],
      content: message.content,
      createdAt: message.createdAt,
      annotations: message.annotations as Annotation[],
      experimental_attachments:
        message.attachments &&
        Array.isArray(message.attachments) &&
        message.attachments.length > 0
          ? message.attachments.map((a) => ({
              name: a,
              url: "",
              contentType: ""
            }))
          : undefined
    })) as Message[];
  },
  async getAllMessages(chatId: string): Promise<Message[]> {
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
      content: message.content,
      createdAt: message.createdAt,
      annotations: message.annotations as Annotation[],
      experimental_attachments:
        message.attachments &&
        Array.isArray(message.attachments) &&
        message.attachments.length > 0
          ? message.attachments.map((a) => ({
              name: a,
              url: "",
              contentType: ""
            }))
          : undefined
    })) as Message[];
  }
};
