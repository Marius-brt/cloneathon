import type { ToolInvocation } from "ai";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { CommandMenuKbd } from "../ui/command";

export function ToolCalling({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  return (
    <div className="flex items-center gap-1">
      {toolInvocation.state === "result" ? (
        <CheckIcon className="size-4" />
      ) : (
        <Loader2Icon className="size-4 animate-spin" />
      )}
      <span className="ml-1 text-sm">Calling tool</span>
      <CommandMenuKbd className="text-sm">{toolInvocation.toolName}</CommandMenuKbd>
    </div>
  );
}
