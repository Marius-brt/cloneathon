"use client";

import { Button } from "@/components/ui/button";
import { saveSettings } from "@/lib/server/actions/settings.action";
import { useAction } from "next-safe-action/hooks";
import { type FormEvent, type ReactNode, useCallback } from "react";
import { toast } from "sonner";

export function Form({ children }: { children: ReactNode }) {
  const { execute, status } = useAction(saveSettings, {
    onSuccess: () => {
      toast.success("Settings saved");
    },
    onError: () => {
      toast.error("Failed to save settings");
    }
  });

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      console.log(data);
      await execute(data);
    },
    [execute]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {children}
      <Button type="submit" className="mt-6" disabled={status === "executing"}>
        {status === "executing" ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
