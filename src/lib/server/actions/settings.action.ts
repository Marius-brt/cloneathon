"use server";
import { protectedAction } from "@/lib/config/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod/v4";
import { saveUserSettings } from "../repositories/user.repository";

const inputSchema = zfd.formData({
  apiKey: zfd.text(z.string().optional())
});

export const saveSettings = protectedAction
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    await saveUserSettings(parsedInput);
  });
