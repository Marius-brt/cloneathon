"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const suggestions = [
  "Write a poem about the beauty of the ocean",
  "Code a simple web app",
  "Translate this text into French",
  "Write an email to quit my job"
];

export function Suggestions({
  input,
  setInput
}: { input: string; setInput: (input: string) => void }) {
  return (
    <div
      className={
        "motion-preset-slide-up fixed top-0 left-0 flex w-full justify-center px-6 pt-[25dvh]"
      }
    >
      <div
        className={cn(
          " flex w-full max-w-3xl flex-col gap-4 transition-all duration-200",
          input.length > 0 && "rotate-x-45 opacity-0 blur-sm"
        )}
      >
        <h1 className="font-bold text-3xl">How can I help you today?</h1>
        <div className="flex flex-col items-start gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant={"ghost"}
              className="justify-start"
              type="button"
              onClick={() => setInput(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
