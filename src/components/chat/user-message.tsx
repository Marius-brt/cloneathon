import { Badge } from "@/components/ui/badge";
import type { Message } from "ai";
import { File } from "lucide-react";

export function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-2">
      <pre className="whitespace-pre-wrap rounded-xl border bg-accent px-4 py-2 font-sans text-accent-foreground text-base md:max-w-[80%]">
        {message.content}
      </pre>
      {message.experimental_attachments && (
        <div className="flex flex-wrap gap-2">
          {message.experimental_attachments.map((file, i) => (
            <Badge
              key={i}
              className="group [&_svg]:!pointer-events-auto flex items-center gap-1"
              variant={"outline"}
            >
              <File className="!size-3.5" />
              <span className="max-w-[150px] truncate text-sm">{file.name}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
