import type { tools } from "@/lib/tools";
import type { ToolSet } from "ai";
import { getContext7Client } from "./context7";
import { webSearchTools } from "./web-search";

const toolsMapper: Record<keyof typeof tools, (() => Promise<ToolSet>) | ToolSet> = {
  context7: getContext7Client,
  websearch: webSearchTools
};

export async function getTools(tools: string[]) {
  const t = tools.filter((tool) => tool in toolsMapper);
  const sets = await Promise.all(
    t.map((tool) => {
      const toolFn = toolsMapper[tool];
      return typeof toolFn === "function" ? toolFn() : toolFn;
    })
  );

  const toolSet: ToolSet = {};

  for (const set of sets) {
    for (const tool of Object.keys(set)) {
      toolSet[tool] = set[tool];
    }
  }

  return toolSet;
}
