import { auth } from "@/lib/config/auth";
import { prisma } from "@/lib/config/db";
import { headers } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers()
  });
});

export const getSafeSession = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
};

export const getUserApiKey = cache(async () => {
  const session = await getSafeSession();

  const data = await prisma.user.findUnique({
    select: {
      apiKey: true
    },
    where: {
      id: session.user.id
    }
  });

  if (!data?.apiKey) {
    throw new Error("No API key found");
  }

  return data.apiKey;
});
