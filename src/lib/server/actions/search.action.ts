"use server";

import { protectedAction } from "@/lib/config/safe-action";
import { z } from "zod/v4";
import { ChatRepository } from "../repositories/chat.repository";

export const searchAction = protectedAction
  .inputSchema(
    z.object({
      query: z.string(),
      ignoreIds: z.array(z.uuid())
    })
  )
  .action(async ({ parsedInput }) => {
    const { query, ignoreIds } = parsedInput;

    return await ChatRepository.searchChats(query, ignoreIds);
  });
