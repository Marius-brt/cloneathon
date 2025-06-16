import { mkdirSync, writeFileSync } from "node:fs";
import { type Model, sanitizeName } from "@/lib/server/openrouter";

const REQUIRED_PARAMETERS = ["max_tokens", "temperature"];

function getProviderAndModelName(name: string) {
  const splt = name.split(":");
  if (splt.length === 1) {
    const splt2 = name.split(" ");
    const provider = splt2[0].replace(/[^a-zA-Z]/g, "");
    return {
      provider_name: provider,
      model_name: name
    };
  }
  return {
    provider_name: splt[0],
    model_name: splt.slice(1).join(" ").trim()
  };
}

async function fetchModels() {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  const data = await response.json();
  const models: Record<string, Model> = {};

  for (const model of data.data) {
    if (
      !model.architecture.input_modalities.includes("text") ||
      !model.architecture.output_modalities.includes("text")
    ) {
      continue;
    }

    if (
      !REQUIRED_PARAMETERS.every((param) => model.supported_parameters.includes(param))
    ) {
      continue;
    }

    const names = getProviderAndModelName(model.name);
    const providerId = sanitizeName(names.provider_name);

    const modelData: Model = {
      id: model.id,
      model_name: names.model_name,
      provider_name: names.provider_name,
      provider_id: providerId,
      reasoning: model.supported_parameters.includes("reasoning"),
      context_window: model.context_length,
      pricing: {
        input: model.pricing.prompt,
        output: model.pricing.completion,
        image: model.pricing.image
      },
      supports_tools:
        model.supported_parameters.includes("tools") &&
        model.supported_parameters.includes("tool_choice"),
      input_capabilities: model.architecture.input_modalities,
      output_capabilities: model.architecture.output_modalities
    };

    models[model.id] = modelData;
  }

  mkdirSync("src/assets", { recursive: true });

  writeFileSync("src/assets/models.json", JSON.stringify(models, null, 2), "utf-8");
}

await fetchModels();
