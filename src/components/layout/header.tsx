import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getSafeSession } from "@/lib/server/auth-utils";
import { CommandPalette } from "../command";
import { Logout } from "./logout";

export async function Header() {
  const session = await getSafeSession();
  return (
    <header className="absolute top-0 right-0 left-0 z-40 flex items-center justify-between p-4">
      <CommandPalette />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            {session.user.image && <AvatarImage src={session.user.image} />}
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <Logout />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
