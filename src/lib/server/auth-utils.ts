import { auth } from "@/lib/config/auth";
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
