import { defaultModel } from "@/lib/ai-providers";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChatSettingsStore = {
  enabledTools: string[];
  aiModel: string;
};

type ChatSettingsStoreActions = {
  toggleTool: (tool: string) => void;
  setAiModel: (model: string) => void;
};

export const useChatSettingsStore = create<
  ChatSettingsStore & ChatSettingsStoreActions
>()(
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
      name: "chat-settings-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
