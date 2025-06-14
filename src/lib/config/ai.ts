import { getUserApiKey } from "@/lib/server/auth-utils";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { cache } from "react";

export const getProvider = cache(async () => {
  const apiKey = await getUserApiKey();

  return createOpenRouter({
    apiKey
  });
});

export const titleGenerationModel = "deepseek/deepseek-chat-v3-0324:free";
