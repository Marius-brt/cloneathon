"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";

export function RetryBtn({
  isStreaming,
  onClick
}: { isStreaming: boolean; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          icon={RefreshCcw}
          className={"relative size-6 disabled:opacity-100 [&_svg]:size-3"}
          disabled={isStreaming}
          onClick={onClick}
        />
      </TooltipTrigger>
      <TooltipContent sideOffset={5}>Re-generate</TooltipContent>
    </Tooltip>
  );
}
