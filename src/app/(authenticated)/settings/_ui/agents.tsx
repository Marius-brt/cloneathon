"use client";

import { AgentSheet } from "@/components/sheets/agent-sheet";
import { Button } from "@/components/ui/button";
import { deleteAgent } from "@/lib/server/actions/agent.action";
import { Edit, PlusIcon, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type Agent = {
  id: string;
  name: string;
  instructions: string;
};

export function Agents({ agents }: { agents: Agent[] }) {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const router = useRouter();
  const { execute } = useAction(deleteAgent, {
    onSuccess: () => {
      toast.success("Agent deleted");
      router.refresh();
    }
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex max-h-[240px] flex-col gap-4 overflow-y-auto">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <div>{agent.name}</div>
              <div className="flex gap-2">
                <Button
                  variant={"secondary"}
                  icon={Edit}
                  size={"icon"}
                  onClick={() => setCurrentAgent(agent)}
                  className="size-7 [&_svg]:size-3"
                />
                <Button
                  variant={"destructive"}
                  icon={Trash}
                  size={"icon"}
                  className="size-7 text-white dark:text-destructive-foreground [&_svg]:size-3"
                  onClick={() => execute({ id: agent.id })}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          icon={PlusIcon}
          variant={"secondary"}
          onClick={() =>
            setCurrentAgent({
              id: "",
              name: "New Agent",
              instructions: ""
            })
          }
        >
          Create Agent
        </Button>
      </div>
      <AgentSheet agent={currentAgent} setCurrentAgent={setCurrentAgent} />
    </>
  );
}
