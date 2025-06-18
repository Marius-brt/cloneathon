import { create } from "zustand";

export type Thread = {
  id: string;
  title: string | null;
};

type CommandStore = {
  threads: Thread[];
};

type CommandStoreActions = {
  addThreads: (threads: Thread[]) => void;
};

export const useCommandStore = create<CommandStore & CommandStoreActions>()((set) => ({
  threads: [],
  addThreads: (threads) =>
    set((state) => {
      const threadMap = new Map<string, Thread>();
      for (const t of threads) {
        threadMap.set(t.id, t);
      }
      for (const t of state.threads) {
        if (!threadMap.has(t.id)) {
          threadMap.set(t.id, t);
        }
      }
      return { threads: Array.from(threadMap.values()) };
    })
}));
