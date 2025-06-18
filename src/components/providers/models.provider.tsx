"use client";

import type { Model } from "@/lib/server/openrouter";
import { useChatSettingsStore } from "@/lib/stores/chat-settings.store";
import type { Agent } from "@prisma/client";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

const ModelsContext = createContext<{
  models: Record<string, Model>;
  agents: Agent[];
  currentAgent: Agent | null;
  getModel: (id: string) => Model | null;
  setCurrentAgent: (agent: Agent | null) => void;
  acceptedFileTypes: string | null;
}>({
  models: {},
  agents: [],
  currentAgent: null,
  getModel: () => null,
  setCurrentAgent: () => null,
  acceptedFileTypes: null
});

export function ModelsProvider({
  children,
  models,
  agents
}: { children: ReactNode; models: Record<string, Model>; agents: Agent[] }) {
  const { modelId } = useChatSettingsStore();
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const getModel = useCallback(
    (id: string) => {
      return models[id] ?? null;
    },
    [models]
  );

  const acceptedFileTypes = useMemo(() => {
    if (!modelId) {
      return null;
    }
    const model = models[modelId];

    if (!model) {
      return null;
    }

    const types: string[] = [];

    if (model.input_capabilities.includes("image")) {
      types.push("image/*");
    }

    if (model.input_capabilities.includes("file")) {
      types.push("application/pdf", ".ts", ".tsx", ".js", ".py", ".md", ".txt");
    }

    return types.join(",");
  }, [modelId, models]);

  return (
    <ModelsContext.Provider
      value={{
        models,
        getModel,
        agents,
        currentAgent,
        setCurrentAgent,
        acceptedFileTypes
      }}
    >
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  return useContext(ModelsContext);
}
