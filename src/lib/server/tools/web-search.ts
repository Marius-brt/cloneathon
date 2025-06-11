import { env } from "@env";
import { tavily } from "@tavily/core";
import { type DataStreamWriter, type ToolSet, tool } from "ai";
import z from "zod";

export function webSearchTools(dataStream: DataStreamWriter): ToolSet {
  const tvly = tavily({ apiKey: env.TAVILY_API_KEY });

  return {
    websearch: tool({
      description: "Search the web for up-to-date information",
      parameters: z.object({
        query: z.string().min(1).max(100).describe("The search query")
      }),
      execute: async ({ query }) => {
        const results = await tvly.search(query, {
          maxResults: 4
        });

        // Write sources to dataStream if available
        for (const [i, result] of results.results.entries()) {
          dataStream.writeSource({
            sourceType: "url",
            id: `search-result-${i}`,
            url: result.url,
            title: result.title
          });
        }

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
        const results = await tvly.search(url, {
          maxResults: 1
        });

        for (const [i, result] of results.results.entries()) {
          dataStream.writeSource({
            sourceType: "url",
            id: `crawl-result-${i}`,
            url: result.url,
            title: result.title
          });
        }

        return results.results;
      }
    })
  };
}
