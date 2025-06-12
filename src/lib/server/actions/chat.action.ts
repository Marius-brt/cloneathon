"use server";

import { titleGenerationModel } from "@/lib/config/ai";
import { protectedAction } from "@/lib/config/safe-action";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { generateText } from "ai";
import z from "zod/v4";

export const generateChatName = protectedAction
  .inputSchema(
    z.object({
      chatId: z.uuid(),
      message: z.string().min(1)
    })
  )
  .action(async ({ parsedInput: { chatId, message } }) => {
    const chat = await ChatRepository.getChatTitle(chatId);

    if (chat && chat.title !== "" && chat.title !== null) {
      return chat.title;
    }

    const title = await generateText({
      model: titleGenerationModel,
      prompt: `
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - the title should be in the SAME LANGUAGE as the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons

      THE USER MESSAGE IS:
      ${message}`,
      maxTokens: 100
    });

    const sanitizedTitle = title.text.trim().replace(/^["']|["']$/g, "");

    await ChatRepository.updateChatTitle(chatId, sanitizedTitle);

    return sanitizedTitle;
  });
