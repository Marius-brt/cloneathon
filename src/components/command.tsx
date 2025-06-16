"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandMenuKbd,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { searchAction } from "@/lib/server/actions/search.action";
import { useDebounce } from "@uidotdev/usehooks";
import { useCommandState } from "cmdk";
import {
  ArrowUpRightIcon,
  CornerDownLeftIcon,
  Loader2,
  type LucideIcon,
  MenuIcon,
  MessageSquareDiff,
  Sparkles
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ActionType = {
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  link?: string;
};

type ChatType = {
  id: string;
  title: string | null;
};

const actions: ActionType[] = [
  {
    label: "New chat",
    icon: MessageSquareDiff,
    shortcut: "⌘N",
    link: "/"
  }
];

function NewChatButton() {
  const search = useCommandState((state) => state.search);
  const router = useRouter();

  const newChat = useCallback(() => {
    router.push(`${crypto.randomUUID()}?prompt=${encodeURIComponent(search)}`);
  }, [router, search]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && search.length > 0) {
        newChat();
      }
    },
    [newChat, search]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <button
      type="button"
      className="relative flex w-full cursor-default select-none items-center gap-3 rounded-md border bg-accent px-3 py-2 text-accent-foreground text-sm outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0"
      onClick={newChat}
    >
      <Sparkles size={16} className="opacity-60" aria-hidden="true" />
      <div className="flex items-center gap-1">
        Ask AI for
        <span className="m-0 max-w-[300px] truncate rounded-md border bg-popover px-1.5 pb-0.5 font-bold">
          {search}
        </span>
      </div>
      <CommandShortcut>
        <CornerDownLeftIcon className="size-[0.625rem]" />
      </CommandShortcut>
    </button>
  );
}

export function CommandPalette({
  recentChats
}: {
  recentChats: ChatType[];
}) {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const debouncedSearch = useDebounce(input, 300);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [chatsSearchResults, setChatsSearchResults] = useState<ChatType[]>([]);
  const path = usePathname();

  const items = useMemo(() => {
    const chats = recentChats.map((chat) => ({
      label: chat.title || "Recent chat",
      icon: ArrowUpRightIcon,
      link: `/${chat.id}`
    }));

    chats.push(
      ...chatsSearchResults.map((chat) => ({
        label: chat.title || "Recent chat",
        icon: ArrowUpRightIcon,
        link: `/${chat.id}`
      }))
    );

    return [
      {
        label: "Actions",
        actions
      },
      ...(chats.length > 0
        ? [
            {
              label: "Recent chats",
              actions: chats
            }
          ]
        : [])
    ] as {
      label: string;
      actions: ActionType[];
    }[];
  }, [recentChats, chatsSearchResults]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (debouncedSearch !== "") {
      setLoading(true);
      searchAction({
        query: debouncedSearch,
        ignoreIds: recentChats.map((chat) => chat.id)
      })
        .then((res) => {
          if (res.data) {
            setChatsSearchResults(res.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setChatsSearchResults([]);
      setLoading(false);
    }
  }, [debouncedSearch, recentChats]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setInput("");
      }, 100);
    }
  }, [open]);

  const handleActionClick = useCallback(
    (action: ActionType) => {
      if (action.link) {
        router.push(action.link);
      }
    },
    [router]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <MenuIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={6} className="flex items-center gap-1.5">
          Toggle menu with
          <kbd className="inline-flex items-center rounded border bg-muted px-1 font-[inherit] font-bold text-[0.7rem] text-muted-foreground">
            ⌘K
          </kbd>
        </TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <DialogContent
          showCloseButton={false}
          className="rounded-xl border-none bg-clip-padding p-0 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
        >
          <Command
            loop
            className="**:data-[slot=command-input]:!h-9 **:data-[slot=command-input-wrapper]:!h-9 rounded-none bg-transparent"
          >
            <CommandInput
              placeholder="Type a command or search..."
              value={input}
              onValueChange={(v) => setInput(v)}
            />
            <CommandList>
              <CommandEmpty className="p-2">
                <NewChatButton />
              </CommandEmpty>
              {items.map((action, i) => (
                <Fragment key={i}>
                  <CommandGroup heading={action.label}>
                    {action.actions.map((action, j) => (
                      <CommandItem
                        value={`${action.label} ${action.link || ""}`}
                        key={`${i}-${j}`}
                        onSelect={() => handleActionClick(action)}
                      >
                        <action.icon
                          size={16}
                          className="opacity-60"
                          aria-hidden="true"
                        />
                        <span>{action.label}</span>
                        {action.shortcut && (
                          <CommandShortcut className="justify-center">
                            {action.shortcut}
                          </CommandShortcut>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {i < actions.length - 1 && <CommandSeparator />}
                </Fragment>
              ))}
            </CommandList>
            {loading && (
              <p className="flex items-center gap-2 px-4 pb-2 text-muted-foreground text-sm">
                <Loader2 className="size-4 animate-spin" />
                Searching for chats...
              </p>
            )}
          </Command>
          <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-lg border-t border-t-neutral-100 bg-neutral-50 px-4 font-medium text-muted-foreground text-xs dark:border-t-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <CommandMenuKbd>
                <CornerDownLeftIcon />
              </CommandMenuKbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
