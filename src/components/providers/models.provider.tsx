"use client";

import type { Model } from "@/lib/server/openrouter";
import { type ReactNode, createContext, useContext } from "react";

const ModelsContext = createContext<Record<string, Model>>({});

export function ModelsProvider({
  children,
  models
}: { children: ReactNode; models: Record<string, Model> }) {
  return <ModelsContext.Provider value={models}>{children}</ModelsContext.Provider>;
}

export function useModels() {
  return useContext(ModelsContext);
}
