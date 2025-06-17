"use client";

import { useModels } from "@/components/providers/models.provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AgentBtn() {
  const { agents, currentAgent, setCurrentAgent } = useModels();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "hover:!bg-popover rounded-lg bg-muted pr-4 dark:bg-transparent",
            currentAgent && "!bg-primary/10 hover:!bg-primary/20 !border-primary/80"
          )}
        >
          <span className="-mt-0.5 text-base opacity-60">@</span>
          <span className="max-w-[100px] truncate">{currentAgent?.name || "Agent"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="overflow-hidden p-0">
        <Command>
          <CommandInput placeholder="Find agent" className="h-9" />
          <CommandList>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  keywords={[agent.name]}
                  className={cn(
                    currentAgent?.id === agent.id && "!border-primary !bg-primary/10"
                  )}
                  onSelect={(currentValue) => {
                    setCurrentAgent(currentValue === currentAgent?.id ? null : agent);
                    setOpen(false);
                  }}
                >
                  {agent.name}
                  {currentAgent?.id === agent.id && (
                    <CheckIcon size={16} className="ml-auto text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="px-2 pt-2 pb-2">
          <Link href="/settings">
            <Button variant="secondary" className="w-full justify-start font-normal">
              <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />
              New agent
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
