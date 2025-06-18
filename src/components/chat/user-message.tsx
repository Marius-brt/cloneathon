import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Message } from "ai";
import { File, Pencil } from "lucide-react";
import { useState } from "react";

export function UserMessage({
  message,
  onEdit
}: { message: Message; onEdit?: (newContent: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const handleSave = () => {
    if (onEdit && editValue.trim() !== "") {
      onEdit(editValue);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(message.content);
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-end gap-2 group">
      <div className="flex w-full items-center justify-end gap-2">
        {editing ? (
          <textarea
            className="field-sizing-content w-full resize-none whitespace-pre-wrap rounded-xl border bg-accent px-4 py-2 font-sans text-accent-foreground text-base md:max-w-[80%]"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
        ) : (
          <pre className="whitespace-pre-wrap rounded-xl border bg-accent px-4 py-2 font-sans text-accent-foreground text-base md:max-w-[80%]">
            {message.content}
          </pre>
        )}
      </div>
      {onEdit && editing && (
        <div className="mt-1 flex gap-2">
          <Button size="sm" variant="outline" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
      {onEdit && !editing && (
        <div className="flex w-full items-center justify-end text-muted-foreground text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            icon={Pencil}
            className={"relative size-6 disabled:opacity-100 [&_svg]:size-3"}
            onClick={() => setEditing(true)}
          />
        </div>
      )}
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
