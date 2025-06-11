"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ModelType, models } from "@/lib/ai-providers";
import { useChatStore } from "@/lib/stores/chat.store";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { capabilitiesIcons, icons } from "../icons";

function ModelCard({
  model,
  active,
  onSelect
}: { model: ModelType; active: boolean; onSelect: () => void }) {
  const Icon = useMemo(() => {
    return icons[model.provider as keyof typeof icons];
  }, [model]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-transparent px-2 py-4 text-center transition-all duration-300",
        active && "border-border bg-muted"
      )}
    >
      <Icon className="!size-6" />
      <span className="font-medium text-sm">{model.label}</span>
      <div className="mt-auto flex items-center gap-2">
        {model.capabilities.map((capability) => {
          const { icon: Icon, color } = capabilitiesIcons[capability];
          return (
            <div key={capability} className={cn(color, "rounded p-1")}>
              <Icon className="!size-3" />
            </div>
          );
        })}
      </div>
    </button>
  );
}

export function ModelBtn() {
  const { aiModel, setAiModel } = useChatStore();

  const currentModel = useMemo(() => {
    return models.find((m) => m.name === aiModel);
  }, [aiModel]);

  const Icon = useMemo(() => {
    return icons[currentModel?.provider as keyof typeof icons];
  }, [currentModel]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className="hover:!bg-popover rounded-lg bg-muted pr-2 dark:bg-transparent"
        >
          {Icon && <Icon className="!size-3" />}
          {currentModel?.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="grid grid-cols-2 gap-2 overflow-hidden p-2"
      >
        {models.map((model) => (
          <ModelCard
            key={model.name}
            model={model}
            active={model.name === aiModel}
            onSelect={() => setAiModel(model.name)}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
