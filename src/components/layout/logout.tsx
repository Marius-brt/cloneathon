"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/config/auth-client";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();
  return (
    <DropdownMenuItem
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/sign-in");
            }
          }
        })
      }
    >
      Logout
    </DropdownMenuItem>
  );
}
