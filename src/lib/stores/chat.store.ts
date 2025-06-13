import type { Message } from "ai";
import { create } from "zustand";

type ChatStore = {
  oldMessages: Message[];
};

type ChatSettingsStoreActions = {
  addOldMessages: (messages: Message[]) => void;
  clearOldMessages: () => void;
};

export const useChatStore = create<ChatStore & ChatSettingsStoreActions>()((set) => ({
  oldMessages: [],
  addOldMessages: (messages) =>
    set((state) => ({ oldMessages: [...state.oldMessages, ...messages] })),
  clearOldMessages: () => set({ oldMessages: [] })
}));
