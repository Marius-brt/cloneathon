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
import { cn } from "@/lib/utils";
import { useCommandState } from "cmdk";
import {
  ArrowUpRightIcon,
  CornerDownLeftIcon,
  type LucideIcon,
  MessageSquareDiff,
  SearchIcon,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ComponentProps, Fragment, useCallback, useEffect, useState } from "react";

type ActionType = {
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  link?: string;
};

const actions: {
  label: string;
  actions: ActionType[];
}[] = [
  {
    label: "Actions",
    actions: [
      {
        label: "New chat",
        icon: MessageSquareDiff,
        shortcut: "⌘N",
        link: "/"
      }
    ]
  },
  {
    label: "Recent chats",
    actions: [
      {
        label: "React Children Error Fix",
        icon: ArrowUpRightIcon
      },
      {
        label: "Next.js 15 Routing",
        icon: ArrowUpRightIcon
      },
      {
        label: "Redis Cache Invalidation",
        icon: ArrowUpRightIcon,
        link: "/67398r324789542340950"
      }
    ]
  }
];

function NewChatButton() {
  const search = useCommandState((state) => state.search);

  const newChat = useCallback(() => {
    alert(`Ask AI for ${search}`);
  }, [search]);

  return (
    <CommandEmpty className="p-2">
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
    </CommandEmpty>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

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

  const handleActionClick = useCallback(
    (action: ActionType) => {
      if (action.link) {
        router.push(action.link);
      }
      setOpen(false);
    },
    [router]
  );

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-fit rounded-md border border-input bg-background px-3 py-2 text-foreground text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="-ms-1 me-3 text-muted-foreground/80"
            size={16}
            aria-hidden="true"
          />
          <span className="font-normal text-muted-foreground/70">Search</span>
        </span>
        <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
          ⌘K
        </kbd>
      </button>
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
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <NewChatButton />
              {actions.map((action, index) => (
                <Fragment key={index}>
                  <CommandGroup heading={action.label}>
                    {action.actions.map((action, index) => (
                      <CommandItem key={index} onSelect={() => handleActionClick(action)}>
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
                  {index < actions.length - 1 && <CommandSeparator />}
                </Fragment>
              ))}
            </CommandList>
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
