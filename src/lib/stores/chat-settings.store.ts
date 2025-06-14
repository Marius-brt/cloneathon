import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChatSettingsStore = {
  enabledTools: string[];
  modelId?: string;
};

type ChatSettingsStoreActions = {
  toggleTool: (tool: string) => void;
  setModelId: (modelId: string) => void;
};

export const useChatSettingsStore = create<
  ChatSettingsStore & ChatSettingsStoreActions
>()(
  persist(
    (set) => ({
      enabledTools: [],
      toggleTool: (tool) =>
        set((state) => ({
          enabledTools: state.enabledTools.includes(tool)
            ? state.enabledTools.filter((t) => t !== tool)
            : [...state.enabledTools, tool]
        })),
      setModelId: (modelId) => set({ modelId })
    }),
    {
      name: "chat-settings-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
