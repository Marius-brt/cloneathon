"use client";

import { Button } from "@/components/ui/button";
import { CommandMenuKbd } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SwitchCard } from "@/components/ui/switch-card";
import { useChatSettingsStore } from "@/lib/stores/chat-settings.store";
import { tools } from "@/lib/tools";
import { Settings2 } from "lucide-react";
import { Fragment, useMemo } from "react";
import { useModels } from "../providers/models.provider";

export function ToolsBtn() {
  const { enabledTools, toggleTool } = useChatSettingsStore();
  const { modelId } = useChatSettingsStore();
  const { models } = useModels();

  const supportsTools = useMemo(() => {
    if (!modelId) {
      return false;
    }
    return models[modelId].supports_tools;
  }, [modelId, models]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          icon={Settings2}
          disabled={!supportsTools}
          className="hover:!bg-popover rounded-lg bg-muted pr-2 dark:bg-transparent"
        >
          Tools
          {supportsTools && (
            <div className="flex items-center gap-1">
              {enabledTools.map((name) => (
                <CommandMenuKbd key={name}>
                  {tools[name as keyof typeof tools].name}
                </CommandMenuKbd>
              ))}
            </div>
          )}
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
