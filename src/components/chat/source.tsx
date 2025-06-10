import type { LanguageModelV1Source } from "@ai-sdk/provider";
import Link from "next/link";

export function Source({ source }: { source: LanguageModelV1Source }) {
  const url = new URL(source.url);

  return (
    <Link
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="motion-preset-slide-up flex max-w-[40%] items-center gap-2 rounded-lg border border-border px-3 py-2"
    >
      {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${url.hostname}`}
        alt={source.title}
        className="h-4 w-4"
      />
      <span className=" truncate text-sm">{source.title}</span>
    </Link>
  );
}
