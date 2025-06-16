import { env } from "@env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { SecondaryStorage } from "better-auth";

const redis = new Redis({
  url: env.UPSTASH_URL,
  token: env.UPSTASH_TOKEN
});

export const secondaryStorage: SecondaryStorage = {
  get: async (key) => {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return typeof value === "string" ? value : JSON.stringify(value);
  },
  set: async (key, value, ttl) => {
    if (ttl) {
      await redis.set(key, value, { ex: ttl });
    } else {
      await redis.set(key, value);
    }
  },
  delete: async (key) => {
    await redis.del(key);
  }
};

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "20 s")
});

export default redis;
