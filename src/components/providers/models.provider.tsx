"use client";

import type { Model } from "@/lib/server/openrouter";
import type { Agent } from "@prisma/client";
import { type ReactNode, createContext, useCallback, useContext, useState } from "react";

const ModelsContext = createContext<{
  models: Record<string, Model>;
  agents: Agent[];
  currentAgent: Agent | null;
  getModel: (id: string) => Model | null;
  setCurrentAgent: (agent: Agent | null) => void;
}>({
  models: {},
  agents: [],
  currentAgent: null,
  getModel: () => null,
  setCurrentAgent: () => null
});

export function ModelsProvider({
  children,
  models,
  agents
}: { children: ReactNode; models: Record<string, Model>; agents: Agent[] }) {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const getModel = useCallback(
    (id: string) => {
      return models[id] ?? null;
    },
    [models]
  );

  return (
    <ModelsContext.Provider
      value={{ models, getModel, agents, currentAgent, setCurrentAgent }}
    >
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  return useContext(ModelsContext);
}
