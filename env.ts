import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.url(),
    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    // Github
    // Social Providers
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Tavily
    TAVILY_API_KEY: z.string().min(1),
    // Upstash
    UPSTASH_URL: z.url(),
    UPSTASH_TOKEN: z.string().min(1)
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: process.env.CHECK_ENV === "false"
});
