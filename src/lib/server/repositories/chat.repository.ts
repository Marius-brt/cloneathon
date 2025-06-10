import { prisma } from "@/lib/config/db";
import { getSafeSession } from "@/lib/server/auth-utils";

export const ChatRepository = {
  async getChat(id: string) {
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
  }
};
