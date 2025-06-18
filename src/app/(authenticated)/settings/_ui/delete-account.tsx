"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/config/auth-client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function DeleteAccount() {
  const router = useRouter();
  const handleDelete = useCallback(async () => {
    await authClient.deleteUser({
      callbackURL: "/",
      fetchOptions: {
        onError: () => {
          toast.error("Failed to delete account. Please try again.");
        },
        onSuccess: () => {
          router.push("/");
        }
      }
    });
  }, [router]);

  return (
    <Button variant="destructive" className="w-full" onClick={handleDelete}>
      Delete my account
    </Button>
  );
}
