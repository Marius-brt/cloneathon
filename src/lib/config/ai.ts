import { createMistral } from "@ai-sdk/mistral";
import { env } from "@env";

const provider = createMistral({
  apiKey: env.MISTRAL_API_KEY
});

export const model = provider("mistral-medium-latest");

export const titleGenerationModel = provider("mistral-medium-latest");
