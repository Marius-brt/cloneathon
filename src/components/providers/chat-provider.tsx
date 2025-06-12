"use client";

import { useChatStore } from "@/lib/stores/chat.store";
import { useMessagesStore } from "@/lib/stores/messages.store";
import { type Message, useChat } from "@ai-sdk/react";
import {
  type ChangeEvent,
  type ReactNode,
  createContext,
  useContext,
  useEffect
} from "react";

const ChatContext = createContext<{
  chatId: string;
  messages: Message[];
  title: string;
  input: string;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
  setInput: (input: string) => void;
}>({
  chatId: "",
  messages: [],
  title: "",
  input: "",
  status: "ready",
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  stop: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  handleInputChange: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  handleSubmit: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  setInput: () => {}
});

export function ChatProvider({
  children,
  initialMessages,
  chatId,
  title
}: { children: ReactNode; initialMessages: Message[]; chatId: string; title: string }) {
  const { setMessages, setCurrentChatId, setChatTitle } = useMessagesStore();
  const { enabledTools } = useChatStore();

  const { messages, input, status, stop, handleInputChange, handleSubmit, setInput } =
    useChat({
      initialMessages,
      body: {
        chatId,
        tools: enabledTools
      },
      experimental_prepareRequestBody: ({ messages }) => {
        const lastMessage = messages.at(-1);
        return {
          chatId,
          tools: enabledTools,
          message: lastMessage
        };
      }
    });

  useEffect(() => {
    setMessages(chatId, messages);
    setCurrentChatId(chatId);
    setChatTitle(title);
  }, [chatId, messages, setMessages, setCurrentChatId, setChatTitle, title]);

  return (
    <ChatContext.Provider
      value={{
        chatId,
        messages,
        title,
        input,
        status,
        stop,
        handleInputChange,
        handleSubmit,
        setInput
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatProvider() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatProvider must be used within a ChatProvider");
  }
  return context;
}

export function useChatMessages() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatMessages must be used within a ChatProvider");
  }
  return {
    messages: context.messages,
    isStreaming: context.status === "streaming" || context.status === "submitted"
  };
}
