"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatTitle } from "@/components/chat/chat-title";
import { Messages } from "@/components/chat/messages";
import { useModels } from "@/components/providers/models.provider";
import { errorsMapper } from "@/lib/errors";
import { generateTitle } from "@/lib/server/actions/title.action";
import { useChatSettingsStore } from "@/lib/stores/chat-settings.store";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function parseError(error: any) {
  const content = error.message.toString();
  try {
    const msg = JSON.parse(content);
    return msg.error;
  } catch {
    return content;
  }
}

export function Chat({
  initialMessages,
  chatId,
  initialTitle,
  initialPrompt
}: {
  initialMessages: Message[];
  chatId: string;
  initialTitle: string | null;
  initialPrompt: string | null;
}) {
  const { enabledTools, modelId } = useChatSettingsStore();
  const [titleGenerated, setTitleGenerated] = useState(
    initialTitle !== null && initialTitle !== ""
  );
  const [title, setTitle] = useState(initialTitle || "");
  const [error, setError] = useState<string | null>(null);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const { currentAgent } = useModels();
  const { input, messages, status, stop, handleSubmit, setInput } = useChat({
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: false,
    onError: (error) => {
      const msg = parseError(error);
      const errorMessage = errorsMapper[msg] || errorsMapper.default;
      setError(errorMessage);
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
        agentId: currentAgent?.id,
        message: lastMessage
      };
    }
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const submitHandler = useCallback(() => {
    if (input.length > 0 && !isStreaming) {
      setError(null);
      handleSubmit();
      setInitialPromptSent(true);

      window.history.replaceState({}, "", `/${chatId}`);

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

  useEffect(() => {
    if (initialPrompt && initialPrompt.length > 0 && !isStreaming && !initialPromptSent) {
      setInput(initialPrompt);
      submitHandler();
    }
  }, [initialPrompt, submitHandler, setInput, isStreaming, initialPromptSent]);

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
