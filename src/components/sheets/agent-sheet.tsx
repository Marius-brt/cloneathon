import type { Agent } from "@/app/(authenticated)/settings/_ui/agents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { upsertAgent } from "@/lib/server/actions/agent.action";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function AgentSheet({
  agent,
  setCurrentAgent
}: { agent: Agent | null; setCurrentAgent: (agent: Agent | null) => void }) {
  const [name, setName] = useState(agent?.name ?? "");
  const [instructions, setInstructions] = useState(agent?.instructions ?? "");
  const isUpdating = !!agent?.id;
  const router = useRouter();

  const { execute } = useAction(upsertAgent, {
    onSuccess: () => {
      toast.success("Agent saved");
      router.refresh();
      setCurrentAgent(null);
    },
    onError: () => {
      toast.error("Failed to create agent");
    }
  });

  const handleSubmit = useCallback(async () => {
    const data = {
      name,
      instructions,
      ...(agent ? { id: agent.id } : {})
    };
    await execute(data);
  }, [execute, agent, name, instructions]);

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setInstructions(agent.instructions);
    }
  }, [agent]);

  return (
    <Sheet open={!!agent} onOpenChange={() => setCurrentAgent(null)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Agent</SheetTitle>
          <SheetDescription>
            Agent allows you to reuse instructions in multiple conversations.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-full flex-col gap-2 px-4">
          <Input
            id="agentName"
            name="agentName"
            placeholder="Agent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            id="agentInstructions"
            name="agentInstructions"
            placeholder="Agent Instructions"
            className="grow resize-none"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <SheetFooter>
          <Button type="button" onClick={handleSubmit}>
            {isUpdating ? "Update Agent" : "Create Agent"}
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            disabled={!name.length || !instructions.length}
            onClick={() => setCurrentAgent(null)}
          >
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
