import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultModel } from "../ai-providers";

type ChatStore = {
  enabledTools: string[];
  aiModel: string;
};

type ChatStoreActions = {
  toggleTool: (tool: string) => void;
  setAiModel: (model: string) => void;
};

export const useChatStore = create<ChatStore & ChatStoreActions>()(
  persist(
    (set) => ({
      enabledTools: [],
      aiModel: defaultModel,
      toggleTool: (tool) =>
        set((state) => ({
          enabledTools: state.enabledTools.includes(tool)
            ? state.enabledTools.filter((t) => t !== tool)
            : [...state.enabledTools, tool]
        })),
      setAiModel: (model) => set({ aiModel: model })
    }),
    {
      name: "chat-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
