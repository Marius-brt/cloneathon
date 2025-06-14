import { env } from "@env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/* const provider = createMistral({
  apiKey: env.MISTRAL_API_KEY
}); */

export const provider = createOpenRouter({
  apiKey: env.MISTRAL_API_KEY
});

export const titleGenerationModel = provider("deepseek/deepseek-chat-v3-0324:free");
