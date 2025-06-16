import type { Message } from "ai";

export function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <pre className="whitespace-pre-wrap rounded-xl border bg-accent px-4 py-2 font-sans text-accent-foreground text-base md:max-w-[80%]">
        {message.content}
      </pre>
    </div>
  );
}
