import { CommandPalette } from "@/components/command";
import { Logout } from "@/components/layout/logout";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getSafeSession } from "@/lib/server/auth-utils";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import Link from "next/link";

export async function Header() {
  const session = await getSafeSession();
  const recentChats = await ChatRepository.getRecentChats();
  return (
    <header className="absolute top-0 right-0 left-0 z-40 flex items-center justify-between p-4">
      <CommandPalette recentChats={recentChats} />
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <Avatar>
            {session.user.image && <AvatarImage src={session.user.image} />}
            <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <ThemeSwitcher />
          </DropdownMenuSub>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <Logout />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
