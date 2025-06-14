import type { LanguageModelUsage } from "ai";

export type Model = {
  id: string;
  model_name: string;
  provider_name: string;
  provider_id: string;
  reasoning: boolean;
  context_window: number;
  pricing: {
    input: string;
    output: string;
    image: string;
  };
  input_capabilities: string[];
  output_capabilities: string[];
};

export type ModelsResponse = Record<string, { name: string; models: Model[] }>;

export function sanitizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function calculateCost(model: Model, usage: LanguageModelUsage) {
  return (
    Number.parseFloat(model.pricing.input) * usage.promptTokens +
    Number.parseFloat(model.pricing.output) * usage.completionTokens
  );
}
