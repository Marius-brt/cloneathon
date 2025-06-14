"use client";

import type { Model } from "@/lib/server/openrouter";
import { type ReactNode, createContext, useCallback, useContext } from "react";

const ModelsContext = createContext<{
  models: Record<string, Model>;
  getModel: (id: string) => Model | null;
}>({
  models: {},
  getModel: () => null
});

export function ModelsProvider({
  children,
  models
}: { children: ReactNode; models: Record<string, Model> }) {
  const getModel = useCallback(
    (id: string) => {
      return models[id] ?? null;
    },
    [models]
  );

  return (
    <ModelsContext.Provider value={{ models, getModel }}>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  return useContext(ModelsContext);
}
