import { MemoizedMarkdown } from "@/components/chat/markdown";
import { Reasoning } from "@/components/chat/reasoning";
import { Source } from "@/components/chat/source";
import { ToolCalling } from "@/components/chat/tool-calling";
import { CopyButton } from "@/components/ui/copy";
import { formatDate } from "@/lib/utils";
import type { Message } from "ai";

export function AssistantMessage({
  message,
  isStreaming
}: {
  message: Message;
  isStreaming: boolean;
}) {
  const sources = message.parts?.filter((part) => part.type === "source") || [];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start gap-6 text-base">
        {message.parts?.map((part, i) => {
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
            case "reasoning":
              return (
                <Reasoning
                  text={part.reasoning}
                  isReasoning={isStreaming && i === (message.parts?.length ?? 0) - 1}
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
      <div className="flex items-center gap-2 py-2 text-muted-foreground text-sm opacity-0 transition-opacity duration-300 hover:opacity-100">
        <CopyButton small value={message.content} />
        {message.createdAt && <span>{formatDate(message.createdAt)}</span>}
      </div>
    </div>
  );
}
