import { env } from "@env";
import { type ToolSet, tool } from "ai";
import z from "zod";

const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: env.TAVILY_API_KEY });

export const webSearchTools: ToolSet = {
  websearch: tool({
    description: "Search the web for up-to-date information",
    parameters: z.object({
      query: z.string().min(1).max(100).describe("The search query")
    }),
    execute: async ({ query }) => {
      const results = await tvly.search(query);
      console.log(results);
      return results.results;
    }
  }),
  crawlUrl: tool({
    description: "Crawl a URL for up-to-date information",
    parameters: z.object({
      url: z
        .string()
        .url()
        .min(1)
        .max(100)
        .describe("The URL to crawl (including http:// or https://)")
    }),
    execute: async ({ url }) => {
      const results = await tvly.search(url);
      console.log(results);
      return results.results;
    }
  })
};
