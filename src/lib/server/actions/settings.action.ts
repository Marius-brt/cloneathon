"use server";

import { protectedAction } from "@/lib/config/safe-action";
import { saveUserSettings } from "@/lib/server/repositories/user.repository";
import { zfd } from "zod-form-data";
import { z } from "zod/v4";

const inputSchema = zfd.formData({
  apiKey: zfd.text(z.string().max(255).optional())
});

export const saveSettings = protectedAction
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    await saveUserSettings(parsedInput);
  });
