import type { socialProviderList } from "better-auth/social-providers";

export type SocialProvider = (typeof socialProviderList)[number];

export type Annotation = {
  type: string;
  value: string | Record<string, any>;
};
