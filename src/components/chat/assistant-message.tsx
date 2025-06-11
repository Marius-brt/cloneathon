import { formatDate } from "@/lib/utils";
import type { UIMessage } from "ai";
import MemoizedMarkdown from "./memoized-markdown";
import { Source } from "./source";
import { ToolCalling } from "./tool-calling";

export function AssistantMessage({ message }: { message: UIMessage }) {
  const sources = message.parts.filter((part) => part.type === "source");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start gap-6 text-base">
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "tool-invocation":
              return (
                <ToolCalling
                  key={`${message.id}-${i}`}
                  toolInvocation={part.toolInvocation}
                />
              );
            case "text":
              return (
                <MemoizedMarkdown
                  key={`${message.id}-${i}`}
                  content={part.text}
                  id={message.id}
                />
              );
            default:
              return null;
          }
        })}
      </div>
      {sources.length > 0 && (
        <div className="flex flex-wrap items-start justify-start gap-2 py-4">
          {sources.map(({ source }) => (
            <Source key={source.id} source={source} />
          ))}
        </div>
      )}
      <div className="text-muted-foreground text-sm opacity-0 transition-opacity duration-300 hover:opacity-100">
        {message.createdAt && <span>{formatDate(message.createdAt)}</span>}
      </div>
    </div>
  );
}
