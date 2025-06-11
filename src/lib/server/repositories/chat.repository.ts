import { prisma } from "@/lib/config/db";
import { getSafeSession } from "@/lib/server/auth-utils";

export const ChatRepository = {
  async getOrCreateChat(id: string) {
    const session = await getSafeSession();
    return await prisma.chat.upsert({
      where: {
        id,
        userId: session.user.id
      },
      update: {},
      create: {
        id,
        userId: session.user.id
      }
    });
  },
  async getRecentChats() {
    const session = await getSafeSession();
    return await prisma.chat.findMany({
      select: {
        id: true,
        title: true
      },
      take: 3,
      orderBy: {
        createdAt: "desc"
      },
      where: {
        userId: session.user.id
      }
    });
  },
  async searchChats(query: string, ignoreIds: string[]) {
    const session = await getSafeSession();
    return await prisma.chat.findMany({
      where: {
        userId: session.user.id,
        title: { contains: query, mode: "insensitive" },
        id: { notIn: ignoreIds }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 4,
      select: {
        id: true,
        title: true
      }
    });
  },
  async getChatTitle(id: string) {
    const session = await getSafeSession();
    return await prisma.chat.findUnique({
      where: {
        id,
        userId: session.user.id
      },
      select: {
        title: true
      }
    });
  },
  async updateChatTitle(id: string, title: string) {
    const session = await getSafeSession();
    return await prisma.chat.upsert({
      where: { id, userId: session.user.id },
      create: { id, userId: session.user.id, title },
      update: { title }
    });
  }
};
