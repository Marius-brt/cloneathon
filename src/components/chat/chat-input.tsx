"use client";

import { AgentBtn } from "@/components/chat/agent-btn";
import { ModelBtn } from "@/components/chat/model-btn";
import { SpeechRecognition } from "@/components/chat/speech-recognition";
import { ToolsBtn } from "@/components/chat/tools-btn";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useCallback } from "react";

export function ChatInput({
  stop,
  handleSubmit,
  isLoading,
  input,
  setInput
}: {
  stop: () => void;
  handleSubmit: () => void;
  isLoading: boolean;
  input: string;
  setInput: (value: string) => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) {
        stop();
      } else {
        handleSubmit();
      }
    },
    [isLoading, stop, handleSubmit]
  );

  return (
    <div className="fixed bottom-0 left-0 z-30 w-full text-base md:px-4 md:pb-4">
      <div className="relative z-20 mx-auto max-w-2xl border bg-gradient-to-b from-stone-200/0 to-70% to-stone-200 shadow-xl max-sm:pb-2 max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 md:rounded-xl dark:from-stone-800/0 dark:to-stone-800">
        <form className="relative top-border-gradient w-full " onSubmit={onSubmit}>
          <Textarea
            id="chat-input"
            value={input}
            placeholder="Ask anything..."
            spellCheck={false}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
            className="!outline-none !ring-0 !bg-background/60 dark:!bg-background/35 !border-t-0 !border-x-0 !text-medium !border-muted dark:!border-white/20 !p-4 !text-base max-h-[200px] min-h-[100px] resize-none rounded-xl backdrop-blur-sm backdrop-filter max-sm:rounded-none"
          />
          <div className="absolute right-2 bottom-2 flex items-center justify-center gap-2 max-sm:right-4 max-sm:bottom-4">
            <SpeechRecognition value={input} setValue={setInput} isLoading={isLoading} />
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
        <div className="flex items-center gap-2 p-2 max-sm:px-4 max-sm:pt-4">
          <ModelBtn />
          <AgentBtn />
          <ToolsBtn />
        </div>
      </div>
    </div>
  );
}
