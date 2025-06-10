"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { useChatStore } from "@/lib/stores/chat.store";
import { type Message, useChat } from "@ai-sdk/react";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

export function Chat({
  chatId,
  initialMessages
}: { chatId: string; initialMessages: Message[] }) {
  const { enabledTools } = useChatStore();
  const { messages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    initialMessages,
    body: {
      chatId,
      tools: enabledTools
    }
  });

  return (
    <>
      <div className="h-screen w-full overflow-y-auto pt-20 pb-[250px]">
        <div className="absolute top-0 left-0 h-20 w-full bg-gradient-to-t from-background/0 to-background" />
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          {messages.map((message) =>
            message.role === "user" ? (
              <UserMessage key={message.id} message={message} />
            ) : (
              <AssistantMessage key={message.id} message={message} />
            )
          )}
        </div>
      </div>
      <ChatInput
        input={input}
        setInput={handleInputChange}
        onSubmit={handleSubmit}
        status={status}
        stop={stop}
      />
    </>
  );
}
