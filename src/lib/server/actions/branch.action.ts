"use server";

import { protectedAction } from "@/lib/config/safe-action";
import { redirect } from "next/navigation";
import z from "zod/v4";
import { MessageRepository } from "../repositories/message.repository";

export const createBranch = protectedAction
  .inputSchema(
    z.object({
      messageId: z.uuid()
    })
  )
  .action(async ({ parsedInput: { messageId } }) => {
    const branchId = await MessageRepository.createBranch(messageId);
    redirect(`/${branchId}`);
  });
