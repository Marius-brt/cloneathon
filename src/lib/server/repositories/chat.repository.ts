import { prisma } from "@/lib/config/db";
import { getSafeSession } from "@/lib/server/auth-utils";

export const ChatRepository = {
  async getChat(id: string) {
    const session = await getSafeSession();
    return await prisma.chat.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });
  },
  async createChat(id?: string) {
    const session = await getSafeSession();
    return await prisma.chat.create({
      data: {
        userId: session.user.id,
        id
      }
    });
  }
};
