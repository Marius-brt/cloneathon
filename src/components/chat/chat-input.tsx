"use client";

import { SpeechRecognition } from "@/components/chat/speech-recognition";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";
import { type ChangeEvent, type FormEvent, type KeyboardEvent, useCallback } from "react";
import { ModelBtn } from "./model-btn";
import { ToolsBtn } from "./tools-btn";

export function ChatInput({
  input,
  setInput,
  onSubmit,
  status,
  stop
}: {
  input: string;
  setInput: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
}) {
  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = useCallback(
    (v: string) => {
      setInput({
        target: {
          value: v
        }
      } as ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>);
    },
    [setInput]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) {
        stop();
      } else {
        onSubmit();
      }
    },
    [isLoading, stop, onSubmit]
  );

  return (
    <div className="fixed bottom-0 left-0 z-30 w-full px-4 pb-4 text-base">
      <div className="relative z-20 mx-auto max-w-2xl rounded-xl border bg-gradient-to-b from-stone-200/0 to-70% to-stone-200 shadow-xl dark:from-stone-800/0 dark:to-stone-800">
        <form className="relative top-border-gradient w-full " onSubmit={handleSubmit}>
          <Textarea
            id="chat-input"
            value={input}
            placeholder="Ask anything..."
            spellCheck={false}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
            className="!outline-none !ring-0 !bg-background/60 dark:!bg-background/35 !border-t-0 !border-x-0 !text-medium !border-muted dark:!border-white/20 !p-4 !text-base min-h-[100px] resize-none rounded-xl backdrop-blur-sm backdrop-filter"
          />
          <div className="absolute right-2 bottom-2 flex items-center justify-center gap-2">
            <SpeechRecognition
              value={input}
              setValue={handleInputChange}
              isLoading={isLoading}
            />
            <Button
              size={"icon"}
              type="submit"
              className="rounded-xl"
              disabled={!isLoading && input.length === 0}
            >
              {isLoading ? <Square /> : <Send className="mr-0.5" />}
            </Button>
          </div>
        </form>
        <div className="flex items-center gap-2 p-2">
          <ModelBtn />
          <ToolsBtn />
        </div>
      </div>
    </div>
  );
}
