"use client";

import { useMessagesStore } from "@/lib/stores/messages.store";

export function ChatTitle() {
  const { chatTitle } = useMessagesStore();
  /*  const { chatTitle, setChatTitle } = useMessagesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(chatTitle === "" ? "New chat" : chatTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleEditing = useCallback(() => {
    if (isEditing) {
      setChatTitle(newValue);
      setIsEditing(false);
    } else {
      setIsEditing(true);
      // select all text
      inputRef.current?.focus();
    }
  }, [isEditing, newValue, setChatTitle]); */

  return (
    <div className="-translate-x-1/2 fixed top-5 left-[50%] z-50 flex items-center justify-center gap-2">
      <span className="max-w-[50vw] truncate font-medium text-sm">
        {chatTitle === "" ? "New chat" : chatTitle}
      </span>
      {/*  {isEditing ? (
        <Input
          className="h-auto max-w-[50vw] bg-background px-2 py-1"
          style={{ width: `${(newValue.length + 1) * 8}ch` }}
          value={newValue}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setNewValue(e.target.value)}
          autoFocus
          maxLength={80}
          ref={inputRef}
        />
      ) : (
        <span className="max-w-[50vw] truncate font-medium text-sm">
          {chatTitle === "" ? "New chat" : chatTitle}
        </span>
      )}
      <Button variant="ghost" size="icon" className="size-6" onClick={toggleEditing}>
        {isEditing ? <Check className="!size-3" /> : <Pencil className="!size-3" />}
      </Button> */}
    </div>
  );
}
