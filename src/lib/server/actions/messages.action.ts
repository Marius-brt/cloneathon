"use server";

import { protectedAction } from "@/lib/config/safe-action";
import { MESSAGES_BATCH_SIZE } from "@/lib/constants";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import z from "zod/v4";

export const getMessages = protectedAction
  .inputSchema(
    z.object({
      chatId: z.uuid(),
      count: z.number().min(MESSAGES_BATCH_SIZE)
    })
  )
  .action(async ({ parsedInput: { chatId, count } }) => {
    const messages = await MessageRepository.getMessagesByChatId(chatId, count);
    return messages.reverse();
  });
