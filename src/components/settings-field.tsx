import type { ReactNode } from "react";

export function SettingsField({
  name,
  description,
  children
}: { name: string; description: string | ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">{name}</span>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}
