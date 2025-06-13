import { env } from "@env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/* const provider = createMistral({
  apiKey: env.MISTRAL_API_KEY
}); */

const provider = createOpenRouter({
  apiKey: env.MISTRAL_API_KEY
});

export const model = provider("deepseek/deepseek-r1-0528:free");

export const titleGenerationModel = provider("deepseek/deepseek-r1-0528:free");
