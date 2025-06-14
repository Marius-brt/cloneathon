import { prisma } from "@/lib/config/db";
import { getSafeSession } from "../auth-utils";

export async function getUserSettings() {
  const session = await getSafeSession();

  const data = await prisma.user.findUnique({
    select: {
      apiKey: true
    },
    where: {
      id: session.user.id
    }
  });

  return data;
}

export async function saveUserSettings(settings: { apiKey?: string }) {
  const session = await getSafeSession();

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      apiKey: settings.apiKey ?? null
    }
  });
}
