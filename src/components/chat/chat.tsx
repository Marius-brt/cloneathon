"use client";

import { AssistantMessage } from "@/components/chat/assistant-message";
import { ChatInput } from "@/components/chat/chat-input";
import { UserMessage } from "@/components/chat/user-message";
import { useChatStore } from "@/lib/stores/chat.store";
import { type Message, useChat } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function Chat({
  chatId,
  initialMessages
}: { chatId: string; initialMessages: Message[] }) {
  const { enabledTools } = useChatStore();
  const chatRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const { messages, input, status, stop, handleInputChange, handleSubmit } = useChat({
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

  const submit = useCallback(() => {
    setAutoScroll(true);
    handleSubmit();

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100);
  }, [handleSubmit]);

  const handleScroll = useCallback(
    (e: Event) => {
      if (e.target instanceof HTMLElement && autoScroll) {
        setAutoScroll(false);
      }
    },
    [autoScroll]
  );

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (autoScroll && status === "streaming") {
      id = setInterval(() => {
        if (chatRef.current) {
          chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 200);
    }
    return () => clearInterval(id);
  }, [autoScroll, status]);

  useEffect(() => {
    if (chatRef.current && (status === "streaming" || status === "submitted")) {
      chatRef.current.addEventListener("wheel", handleScroll);
    }
    return () => {
      if (chatRef.current) {
        chatRef.current?.removeEventListener("wheel", handleScroll);
      }
    };
  }, [handleScroll, status]);

  return (
    <>
      <div
        ref={chatRef}
        className="h-screen w-full overflow-y-auto px-4 pt-20 pb-[250px]"
      >
        <div className="absolute top-0 left-0 h-20 w-full bg-gradient-to-t from-background/0 to-background" />
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          {messages.map((message) =>
            message.role === "user" ? (
              <UserMessage key={message.id} message={message} />
            ) : (
              <AssistantMessage key={message.id} message={message} />
            )
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-3 animate-spin" />
              <span>Thinking</span>
            </div>
          )}
        </div>
      </div>
      <ChatInput
        input={input}
        setInput={handleInputChange}
        onSubmit={submit}
        status={status}
        stop={stop}
      />
    </>
  );
}
