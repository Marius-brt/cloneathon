import { readFileSync } from "node:fs";
import type { Model } from "@/lib/server/openrouter";

export const models: Record<string, Model> = JSON.parse(
  readFileSync("src/assets/models.json", "utf-8")
);
