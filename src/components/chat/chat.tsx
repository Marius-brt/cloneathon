"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatTitle } from "@/components/chat/chat-title";
import { Messages } from "@/components/chat/messages";
import { generateTitle } from "@/lib/server/actions/title.action";
import { useChatSettingsStore } from "@/lib/stores/chat-settings.store";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function Chat({
  initialMessages,
  chatId,
  initialTitle
}: {
  initialMessages: Message[];
  chatId: string;
  initialTitle: string | null;
}) {
  const { enabledTools, modelId } = useChatSettingsStore();
  const [titleGenerated, setTitleGenerated] = useState(
    initialTitle !== null && initialTitle !== ""
  );
  const [title, setTitle] = useState(initialTitle || "");
  const [error, setError] = useState<string | null>(null);
  const { input, messages, status, stop, handleSubmit, setInput } = useChat({
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: false,
    onError: (error) => {
      try {
        const data = JSON.parse(error.message);
        if (data.code === "key_missing") {
          setError(
            "No API key found. Please add an OpenRouter API key in your settings."
          );
        } else {
          setError("An error occurred. Please try again.");
        }
      } catch {
        setError("An error occurred. Please try again.");
      }
    },
    onFinish: () => {
      window.history.replaceState({}, "", `/${chatId}`);
      window.dispatchEvent(new CustomEvent("chat-history-updated"));
    },
    experimental_prepareRequestBody: ({ messages }) => {
      const lastMessage = messages.filter((message) => message.role === "user").at(-1);
      if (!lastMessage) {
        throw new Error("No message found");
      }
      return {
        chatId,
        tools: enabledTools,
        modelId,
        message: lastMessage
      };
    }
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const submitHandler = useCallback(() => {
    if (input.length > 0 && !isStreaming) {
      handleSubmit();

      if (!titleGenerated) {
        const firstUserMessage = messages.find((message) => message.role === "user");
        generateTitle({
          chatId,
          message: firstUserMessage?.content || input
        })
          .then((data) => {
            if (data.data) {
              setTitle(data.data);
              setTitleGenerated(true);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    }
  }, [handleSubmit, input, isStreaming, titleGenerated, messages, chatId]);

  return (
    <>
      <ChatTitle title={title} />
      <Messages
        error={error}
        messages={messages}
        isStreaming={isStreaming}
        chatId={chatId}
        submitted={status === "submitted"}
      />
      <ChatInput
        stop={stop}
        handleSubmit={submitHandler}
        isLoading={isStreaming}
        input={input}
        setInput={setInput}
      />
    </>
  );
}
