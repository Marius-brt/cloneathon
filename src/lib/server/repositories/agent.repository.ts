import { prisma } from "@/lib/config/db";
import { getSafeSession } from "@/lib/server/auth-utils";

export const AgentRepository = {
  async getAgents() {
    const session = await getSafeSession();

    const agents = await prisma.agent.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return agents;
  },
  async getAgent(id: string) {
    const session = await getSafeSession();

    return prisma.agent.findUnique({
      where: { id, userId: session.user.id },
      select: {
        instructions: true
      }
    });
  },
  async upsertAgent(id: string, name: string, instructions: string) {
    const session = await getSafeSession();

    const agent = await prisma.agent.upsert({
      where: {
        id
      },
      update: {
        name,
        instructions
      },
      create: {
        name,
        instructions,
        userId: session.user.id
      }
    });

    return agent;
  },
  async deleteAgent(id: string) {
    const session = await getSafeSession();

    await prisma.agent.delete({
      where: { id, userId: session.user.id }
    });
  }
};
