import { prisma } from "@/lib/config/db";
import { MESSAGES_BATCH_SIZE } from "@/lib/constants";
import { getSafeSession } from "@/lib/server/auth-utils";
import type { Annotation } from "@/lib/types";
import type { Message } from "@ai-sdk/react";
import type { Prisma } from "@prisma/client";

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
  },
  async createBranch(messageId: string) {
    const session = await getSafeSession();

    const chat = await prisma.message.findFirst({
      where: {
        id: messageId,
        role: "assistant",
        chat: {
          userId: session.user.id
        }
      },
      select: {
        chat: {
          select: {
            title: true
          }
        },
        chatId: true
      }
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: chat.chatId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const targetMessage = messages.find((msg) => msg.id === messageId);

    if (!targetMessage) {
      throw new Error("Message not found in chat");
    }

    const filteredMessages = messages.filter(
      (msg) => msg.createdAt <= targetMessage.createdAt
    );

    const branch = await prisma.chat.create({
      data: {
        id: crypto.randomUUID(),
        title: chat.chat.title
          ? chat.chat.title.endsWith("- Branch")
            ? chat.chat.title
            : `${chat.chat.title} - Branch`
          : undefined,
        userId: session.user.id
      }
    });

    await prisma.message.createMany({
      data: filteredMessages.map((msg) => ({
        chatId: branch.id,
        parts: (msg.parts ?? null) as Prisma.InputJsonValue,
        annotations: (msg.annotations ?? null) as Prisma.InputJsonValue,
        attachments: (msg.attachments ?? null) as Prisma.InputJsonValue,
        createdAt: msg.createdAt,
        content: msg.content,
        modelId: msg.modelId,
        role: msg.role
      }))
    });

    return branch.id;
  }
};
