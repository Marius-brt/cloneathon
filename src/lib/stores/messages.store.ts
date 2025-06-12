import type { Message } from "@ai-sdk/react";
import { create } from "zustand";

type MessagesStore = {
  chats: Record<string, Message[]>;
  currentChatId: string;
  chatTitle: string;
};

type MessagesStoreActions = {
  addMessage: (chatId: string, message: Message) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  setCurrentChatId: (chatId: string) => void;
  setChatTitle: (title: string) => void;
};

export const useMessagesStore = create<MessagesStore & MessagesStoreActions>((set) => ({
  chats: {},
  currentChatId: "",
  chatTitle: "",
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: { ...state.chats, [chatId]: [...state.chats[chatId], message] }
    })),
  setMessages: (chatId, messages) =>
    set((state) => ({ chats: { ...state.chats, [chatId]: messages } })),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  setChatTitle: (title) => set({ chatTitle: title })
}));
