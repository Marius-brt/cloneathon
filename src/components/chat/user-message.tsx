import type { UIMessage } from "ai";

export function UserMessage({ message }: { message: UIMessage }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-xl border bg-accent px-4 py-2 text-accent-foreground">
        {message.content}
      </div>
    </div>
  );
}
