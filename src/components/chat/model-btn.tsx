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
import { Bot, Brain, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
        "flex h-[150px] w-[110px] shrink-0 flex-col items-center gap-2 rounded-lg border border-transparent px-2 pt-3 pb-2 text-center transition-all duration-300",
        active && "border-border bg-muted"
      )}
    >
      {Icon && <Icon className="!size-7 shrink-0" />}
      <span className="font-medium text-sm">{model.model_name}</span>
      <div className="mt-auto flex items-center gap-2">
        {model.reasoning && (
          <div className={"rounded bg-purple-500/10 p-1 text-purple-500"}>
            <Brain className="!size-3" />
          </div>
        )}
        {model.input_capabilities.map((capability) => {
          if (!capabilitiesIcons[capability as keyof typeof capabilitiesIcons]) {
            return null;
          }
          const { icon: Icon, color } =
            capabilitiesIcons[capability as keyof typeof capabilitiesIcons];
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
    setResults(
      (debouncedSearch.length > 0
        ? Object.values(models).filter(
            (model) =>
              model.model_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              model.provider_name.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        : Object.values(models).slice(0, 10)
      ).sort((a, b) => a.id.localeCompare(b.id))
    );
  }, [debouncedSearch, models]);

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
        <div className="flex max-h-[400px] min-h-[200px] w-full flex-wrap gap-3 overflow-y-auto">
          {results.length === 0 && (
            <div className="flex w-full items-center justify-center">
              <span className="text-muted-foreground text-sm">No models found</span>
            </div>
          )}
          {Object.values(results).map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              active={model.id === modelId}
              onSelect={() => setModel(model.id)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
