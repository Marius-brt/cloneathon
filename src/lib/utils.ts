import type { SocialProvider } from "@/lib/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const providerNames: Record<SocialProvider, string> = {
  google: "Google",
  github: "GitHub",
  twitter: "Twitter",
  discord: "Discord",
  facebook: "Facebook",
  apple: "Apple",
  microsoft: "Microsoft",
  spotify: "Spotify",
  twitch: "Twitch",
  dropbox: "Dropbox",
  kick: "Kick",
  linkedin: "LinkedIn",
  gitlab: "GitLab",
  tiktok: "TikTok",
  reddit: "Reddit",
  roblox: "Roblox",
  vk: "VK",
  zoom: "Zoom"
};

export function formatDate(date: Date | string) {
  return format(date, "MMMM dd, yyyy hh:mm a");
}
