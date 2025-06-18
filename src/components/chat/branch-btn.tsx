"use client";

import { Button } from "@/components/ui/button";
import { createBranch } from "@/lib/server/actions/branch.action";
import { GitBranch } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function BranchBtn({
  messageId,
  isStreaming
}: { messageId: string; isStreaming: boolean }) {
  const { execute, status } = useAction(createBranch, {
    onSuccess: () => {
      toast.success("Branch created");
    },
    onError: () => {
      toast.error("Failed to create branch");
    }
  });

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          loading={status === "executing"}
          icon={GitBranch}
          className={"relative size-6 disabled:opacity-100 [&_svg]:size-3"}
          onClick={() => execute({ messageId })}
          disabled={isStreaming}
        />
      </TooltipTrigger>
      <TooltipContent>Create a branch from here</TooltipContent>
    </Tooltip>
  );
}
