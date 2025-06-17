import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SettingsField({
  name,
  description,
  className,
  children
}: {
  name: string;
  description: string | ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-10 sm:grid-cols-2", className)}>
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">{name}</span>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}
