import type { UIMessage } from "ai";
import MemoizedMarkdown from "./memoized-markdown";
import { ToolCalling } from "./tool-calling";

export function AssistantMessage({ message }: { message: UIMessage }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start gap-6 whitespace-pre-wrap text-base">
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
      <div className="text-muted-foreground text-sm">
        {message.createdAt && <span>{message.createdAt.toLocaleString()}</span>}
      </div>
    </div>
  );
}
