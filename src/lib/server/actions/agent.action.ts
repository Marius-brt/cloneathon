"use server";
import { protectedAction } from "@/lib/config/safe-action";
import { AgentRepository } from "@/lib/server/repositories/agent.repository";
import { z } from "zod/v4";

export const upsertAgent = protectedAction
  .inputSchema(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1).max(255),
      instructions: z.string().min(1).max(1000)
    })
  )
  .action(async ({ parsedInput: { id, name, instructions } }) => {
    await AgentRepository.upsertAgent(id ?? crypto.randomUUID(), name, instructions);
  });

export const deleteAgent = protectedAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    await AgentRepository.deleteAgent(id);
  });
