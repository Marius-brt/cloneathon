"use client";

import { AssistantMessage } from "@/components/chat/assistant-message";
import { UserMessage } from "@/components/chat/user-message";
import { MESSAGES_BATCH_SIZE } from "@/lib/constants";
import { getMessages } from "@/lib/server/actions/messages.action";
import { useChatStore } from "@/lib/stores/chat.store";
import type { Message } from "ai";
import { CircleAlert, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function Messages({
  messages,
  isStreaming,
  submitted,
  chatId,
  error
}: {
  messages: Message[];
  isStreaming: boolean;
  submitted: boolean;
  chatId: string;
  error: string | null;
}) {
  const { oldMessages, addOldMessages } = useChatStore();
  const [autoScroll, setAutoScroll] = useState(true);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const allMessages = useMemo(
    () => [...oldMessages, ...messages],
    [oldMessages, messages]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "instant"
      });
    }
  }, []);

  const handleScroll = useCallback(async () => {
    if (!ref.current) {
      return;
    }
    const el = ref.current;

    // Load more messages when scrolling to the top
    if (
      !loadingMore &&
      el.scrollTop === 0 &&
      allMessages.length >= MESSAGES_BATCH_SIZE &&
      !noMoreMessages
    ) {
      setLoadingMore(true);
      const result = await getMessages({
        chatId,
        count: allMessages.length
      });
      if (result.data) {
        addOldMessages(result.data);
        if (result.data.length < MESSAGES_BATCH_SIZE) {
          setNoMoreMessages(true);
        }
      }
      setLoadingMore(false);
    }

    // Disable auto scroll when streaming
    if (isStreaming && autoScroll) {
      setAutoScroll(false);
    }
  }, [
    autoScroll,
    allMessages.length,
    chatId,
    loadingMore,
    addOldMessages,
    isStreaming,
    noMoreMessages
  ]);

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
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener("wheel", handleScroll);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("wheel", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div
      ref={ref}
      className="h-dvh w-full overflow-y-auto overflow-x-hidden px-4 pt-20 pb-[250px]"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {loadingMore && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-3 animate-spin" />
            Loading older messages...
          </div>
        )}
        {allMessages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage
              key={message.id}
              message={message}
              isStreaming={isStreaming}
            />
          )
        )}
        {submitted && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-3 animate-spin" />
            <span>Thinking</span>
          </div>
        )}
        {error && (
          <div className="rounded-md border px-4 py-3">
            <p className="text-sm">
              <CircleAlert
                className="-mt-0.5 me-3 inline-flex text-red-500"
                size={16}
                aria-hidden="true"
              />
              <span>{error}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
