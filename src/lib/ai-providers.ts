export type AIProvider = "mistral" | "openai" | "grok" | "gemini" | "anthropic";

export type ModelCapability = "tools" | "vision" | "image" | "reasoning";

export type ModelType = {
  name: string;
  provider: AIProvider;
  label: string;
  capabilities: ModelCapability[];
};

export const models: ModelType[] = [
  {
    provider: "mistral",
    name: "mistral-large-latest",
    label: "Mistral Largest",
    capabilities: ["tools", "vision", "reasoning"]
  },
  {
    provider: "mistral",
    name: "mistral-small-latest",
    label: "Mistral Small",
    capabilities: ["tools", "vision", "image", "reasoning"]
  },
  {
    provider: "openai",
    name: "gpt-4o",
    label: "GPT-4o",
    capabilities: ["tools", "vision", "image", "reasoning"]
  },
  {
    provider: "openai",
    name: "gpt-4o-mini",
    label: "GPT-4o Mini",
    capabilities: ["tools", "vision", "image", "reasoning"]
  }
];

export const defaultModel = models[0].name;
