"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SwitchCard } from "@/components/ui/switch-card";
import { useChatStore } from "@/lib/stores/chat.store";
import { tools } from "@/lib/tools";
import { Settings2 } from "lucide-react";
import { Fragment } from "react";
import { CommandMenuKbd } from "../ui/command";

export function ToolsBtn() {
  const { enabledTools, toggleTool } = useChatStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          icon={Settings2}
          className="rounded-lg pr-2"
        >
          Tools
          <div className="flex items-center gap-1">
            {enabledTools.map((name) => (
              <CommandMenuKbd key={name}>
                {tools[name as keyof typeof tools].name}
              </CommandMenuKbd>
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        {Object.entries(tools).map(([key, tool], i) => (
          <Fragment key={key}>
            <SwitchCard
              title={tool.name}
              description={tool.description}
              icon={<tool.icon className="!size-5" />}
              className="p-4"
              value={enabledTools.includes(key)}
              onChange={() => toggleTool(key)}
            />
            {i < Object.keys(tools).length - 1 && <Separator />}
          </Fragment>
        ))}
      </PopoverContent>
    </Popover>
  );
}
