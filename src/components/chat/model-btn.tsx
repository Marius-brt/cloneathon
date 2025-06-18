"use client";

import { capabilitiesIcons, icons } from "@/components/icons";
import { useModels } from "@/components/providers/models.provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Model } from "@/lib/server/openrouter";
import { useChatSettingsStore } from "@/lib/stores/chat-settings.store";
import { cn } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { Bot, Brain, type LucideIcon, Search, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function Capability({
  icon: Icon,
  color,
  label
}: { icon: LucideIcon; color: string; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(color, "rounded p-1")}>
          <Icon className="!size-3" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ModelCard({
  model,
  active,
  onSelect
}: { model: Model; active: boolean; onSelect: () => void }) {
  const Icon = useMemo(() => {
    if (!icons[model.provider_id as keyof typeof icons]) {
      return Bot;
    }
    return icons[model.provider_id as keyof typeof icons];
  }, [model]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "hover:!bg-primary/10 flex min-h-[150px] shrink-0 flex-col items-center gap-2 rounded-lg border px-2 pt-3 pb-2 text-center transition-all duration-300",
        active && "border-primary bg-primary/10"
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className="!size-7 shrink-0" />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            ${(Number(model.pricing?.input || 0) * 1000000).toFixed(1)}/M input tokens
          </p>
          <p>
            ${(Number(model.pricing?.output || 0) * 1000000).toFixed(1)}/M output tokens
          </p>
        </TooltipContent>
      </Tooltip>
      <span className="font-medium text-sm">{model.model_name}</span>
      <div className="mt-auto flex items-center gap-2">
        {model.reasoning && (
          <Capability
            icon={Brain}
            color="bg-purple-500/10 text-purple-500"
            label="Reasoning"
          />
        )}
        {model.supports_tools && (
          <Capability
            icon={Wrench}
            color="bg-orange-500/10 text-orange-500"
            label="Tools"
          />
        )}
        {model.input_capabilities.map((capability) => {
          if (!capabilitiesIcons[capability as keyof typeof capabilitiesIcons]) {
            return null;
          }
          const {
            icon: Icon,
            color,
            label
          } = capabilitiesIcons[capability as keyof typeof capabilitiesIcons];
          return <Capability key={capability} icon={Icon} color={color} label={label} />;
        })}
      </div>
    </button>
  );
}

export function ModelBtn() {
  const { models } = useModels();
  const { modelId, setModelId } = useChatSettingsStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 100);
  const [results, setResults] = useState<Model[]>([]);
  const [open, setOpen] = useState(false);

  const currentModel = useMemo(() => {
    if (!modelId) {
      return null;
    }
    return models[modelId];
  }, [modelId, models]);

  const Icon = useMemo(() => {
    if (!currentModel || !icons[currentModel.provider_id as keyof typeof icons]) {
      return Bot;
    }
    return icons[currentModel.provider_id as keyof typeof icons];
  }, [currentModel]);

  useEffect(() => {
    let resultModels: Model[];
    if (debouncedSearch.length > 0) {
      const searchWords = debouncedSearch.toLowerCase().split(/\s+/).filter(Boolean);

      resultModels = Object.values(models).filter((model) => {
        const modelName = model.model_name.toLowerCase();
        const providerName = model.provider_name.toLowerCase();
        return searchWords.every(
          (word) => modelName.includes(word) || providerName.includes(word)
        );
      });
    } else if (modelId) {
      const allModels = Object.values(models);
      const selectedModel = allModels.find((model) => model.id === modelId);
      const otherModels = allModels.filter((model) => model.id !== modelId).slice(0, 7);
      resultModels = selectedModel ? [selectedModel, ...otherModels] : otherModels;
    } else {
      resultModels = Object.values(models).slice(0, 8);
    }
    setResults(resultModels.sort((a, b) => a.id.localeCompare(b.id)));
  }, [debouncedSearch, models, modelId]);

  const setModel = useCallback(
    (id: string) => {
      setModelId(id);
      setOpen(false);
    },
    [setModelId]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className="hover:!bg-popover rounded-lg bg-muted pr-2 dark:bg-transparent"
        >
          {Icon && <Icon className="!size-3" />}
          {currentModel?.model_name}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-[640px] flex-col gap-2 overflow-hidden p-2 max-sm:w-[calc(100vw-1rem)]"
      >
        <div className="relative w-full">
          <Search className="-translate-y-1/2 absolute top-1/2 left-2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search models"
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search.length > 0 && (
            <X
              className="-translate-y-1/2 absolute top-1/2 right-2 size-4"
              onClick={() => setSearch("")}
            />
          )}
        </div>
        {results.length === 0 ? (
          <div className="flex w-full items-center justify-center py-6">
            <span className="text-muted-foreground text-sm">No models found</span>
          </div>
        ) : (
          <div className="grid max-h-[400px] min-h-[200px] w-full grid-cols-4 flex-wrap gap-3 overflow-y-auto">
            {Object.values(results).map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                active={model.id === modelId}
                onSelect={() => setModel(model.id)}
              />
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
