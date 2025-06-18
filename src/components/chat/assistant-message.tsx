import { MemoizedMarkdown } from "@/components/chat/markdown";
import { Reasoning } from "@/components/chat/reasoning";
import { Source } from "@/components/chat/source";
import { ToolCalling } from "@/components/chat/tool-calling";
import { icons } from "@/components/icons";
import { useModels } from "@/components/providers/models.provider";
import { CopyButton } from "@/components/ui/copy";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Annotation } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import type { Message } from "ai";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { BranchBtn } from "./branch-btn";

export function AssistantMessage({
  message,
  isStreaming
}: {
  message: Message;
  isStreaming: boolean;
}) {
  const sources = message.parts?.filter((part) => part.type === "source") || [];

  const { getModel } = useModels();

  const model = useMemo(() => {
    const modelId = (message.annotations as Annotation[])?.find(
      (annotation) => annotation.type === "model_id"
    )?.value;
    return modelId ? getModel(modelId as string) : null;
  }, [message.annotations, getModel]);

  const ModelIcon = useMemo(() => {
    if (!model) {
      return null;
    }
    return icons[model.provider_id as keyof typeof icons] ?? null;
  }, [model]);

  const cost = useMemo(() => {
    const usage = (message.annotations as Annotation[])?.find(
      (annotation) => annotation.type === "usage"
    );
    if (!usage) {
      return null;
    }
    // @ts-ignore
    return usage.value as {
      cost: number;
      input: number;
      output: number;
    };
  }, [message.annotations]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start gap-6 text-base">
        {(message.parts?.length || 0) <= 1 && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-3 animate-spin" />
            <span>Thinking</span>
          </div>
        )}
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
                  key={`${message.id}-${i}`}
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
      <div className="flex items-center justify-between gap-2 py-2 text-muted-foreground text-sm opacity-0 transition-opacity duration-300 hover:opacity-100">
        <div className="flex items-center gap-2">
          <CopyButton small value={message.content} />
          <BranchBtn messageId={message.id} isStreaming={isStreaming} />
          {message.createdAt && <span>{formatDate(message.createdAt)}</span>}
        </div>
        <div className="flex items-center gap-2">
          {ModelIcon && <ModelIcon className="size-4" />}
          {model?.model_name}
          {cost !== null && (
            <>
              <span>•</span>
              <Tooltip>
                <TooltipTrigger>
                  <span>{cost.cost > 0 ? cost.cost.toFixed(4) : "0"}$</span>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  sideOffset={10}
                  className="flex items-center gap-1"
                >
                  <span>{cost.input} input tokens</span>
                  <span>•</span>
                  <span>{cost.output} output tokens</span>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
