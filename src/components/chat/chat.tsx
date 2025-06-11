"use client";

import { AssistantMessage } from "@/components/chat/assistant-message";
import { ChatInput } from "@/components/chat/chat-input";
import { UserMessage } from "@/components/chat/user-message";
import { Button } from "@/components/ui/button";
import { generateChatName } from "@/lib/server/actions/chat.action";
import { useChatStore } from "@/lib/stores/chat.store";
import { type Message, useChat } from "@ai-sdk/react";
import { Loader2, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function Chat({
  chatId,
  initialMessages,
  title
}: { chatId: string; initialMessages: Message[]; title: string }) {
  const { enabledTools } = useChatStore();
  const chatRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [chatTitle, setChatTitle] = useState(title !== "" ? title : "New chat");
  const [isTitleGenerated, setIsTitleGenerated] = useState(
    initialMessages.length > 0 && title !== ""
  );

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

  const submit = useCallback(async () => {
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

    if (!isTitleGenerated) {
      const text = messages.find((m) => m.role === "user")?.content;

      const title = await generateChatName({
        chatId,
        message: text || input
      });

      if (title.data) {
        setChatTitle(title.data);
        setIsTitleGenerated(true);
      }
    }
  }, [chatId, handleSubmit, input, isTitleGenerated, messages]);

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

  useEffect(() => {
    if (chatRef.current && initialMessages.length > 0) {
      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "instant"
        });
      }, 200);
    }
  }, [initialMessages]);

  return (
    <>
      <div className="absolute top-5 right-0 left-0 flex justify-center">
        <div className="relative z-50 flex max-w-[40%] items-center gap-2">
          <span className="truncate font-medium text-sm">{chatTitle}</span>
          <Button variant="ghost" size="icon" className="size-6">
            <Pencil className="!size-3" />
          </Button>
        </div>
      </div>
      <div className="fixed top-0 left-0 z-20 h-22 w-full bg-gradient-to-t from-background/0 via-60% via-background to-background" />
      <div
        ref={chatRef}
        className="h-dvh w-full overflow-y-auto overflow-x-hidden px-4 pt-20 pb-[250px]"
      >
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
      <div className="pointer-events-none fixed bottom-0 left-0 h-[180px] w-full bg-gradient-to-b from-background/0 via-70% via-background to-background" />
    </>
  );
}
