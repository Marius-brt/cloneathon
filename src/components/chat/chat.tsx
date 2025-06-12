"use client";

import { AssistantMessage } from "@/components/chat/assistant-message";
import { UserMessage } from "@/components/chat/user-message";
import { useChatMessages } from "@/components/providers/chat-provider";
import type { Message } from "ai";
import { memo, useCallback, useEffect, useRef, useState } from "react";

export const Chat = memo(function Chat({
  initialMessages
}: { initialMessages: Message[] }) {
  const { messages: liveMessages, isStreaming } = useChatMessages();
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [autoScroll, setAutoScroll] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveMessages && liveMessages.length > 0) {
      setMessages(liveMessages);
    }
  }, [liveMessages]);

  useEffect(() => {
    if (ref.current && initialMessages.length > 0) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "instant"
      });
    }
  }, [initialMessages]);

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
    if (autoScroll && isStreaming) {
      id = setInterval(() => {
        if (ref.current) {
          ref.current.scrollTo({
            top: ref.current.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 200);
    }
    return () => clearInterval(id);
  }, [autoScroll, isStreaming]);

  useEffect(() => {
    if (ref.current && (isStreaming || status === "submitted")) {
      ref.current.addEventListener("wheel", handleScroll);
    }
    return () => {
      if (ref.current) {
        ref.current?.removeEventListener("wheel", handleScroll);
      }
    };
  }, [handleScroll, isStreaming]);

  return (
    <div
      ref={ref}
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
      </div>
    </div>
  );
});
