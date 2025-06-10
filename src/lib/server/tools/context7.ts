import { type ToolSet, experimental_createMCPClient } from "ai";

export async function getContext7Client() {
  const client = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "https://mcp.context7.com/sse"
    }
  });

  return client.tools() as unknown as ToolSet;
}
