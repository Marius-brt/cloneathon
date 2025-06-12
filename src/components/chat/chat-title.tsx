"use client";

import { Button } from "@/components/ui/button";
import { useMessagesStore } from "@/lib/stores/messages.store";
import { Pencil } from "lucide-react";

export function ChatTitle() {
  const { chatTitle } = useMessagesStore();

  return (
    <div className="-translate-x-1/2 fixed top-5 left-[50%] z-50 flex items-center justify-center">
      <span className="max-w-[50vw] truncate font-medium text-sm">
        {chatTitle === "" ? "New chat" : chatTitle}
      </span>
      <Button variant="ghost" size="icon" className="size-6">
        <Pencil className="!size-3" />
      </Button>
    </div>
  );
}
