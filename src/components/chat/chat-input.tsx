"use client";

import { SpeechRecognition } from "@/components/chat/speech-recognition";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useCallback } from "react";
import { ModelBtn } from "./model-btn";
import { ToolsBtn } from "./tools-btn";

export function ChatInput({
  input,
  setInput,
  onSubmit
}: {
  input: string;
  setInput: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}) {
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

  return (
    <div className="absolute bottom-0 left-0 w-full pb-4 text-base">
      <div className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-b from-background/0 via-background to-background" />
      <div className="relative z-20 mx-auto max-w-2xl rounded-xl bg-muted shadow-xl">
        <form className="relative w-full" onSubmit={onSubmit}>
          <Textarea
            value={input}
            placeholder="Ask anything..."
            onChange={setInput}
            onKeyDown={handleKeyDown}
            className="!outline-none !ring-0 !bg-card !text-medium !border-muted !p-4 !text-base min-h-[100px] resize-none rounded-xl"
          />
          <div className="absolute right-2 bottom-2 flex items-center justify-center gap-2">
            <SpeechRecognition value={input} setValue={handleInputChange} />
            <Button size={"icon"} type="submit" className="rounded-xl">
              <Send className="mr-0.5" />
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
