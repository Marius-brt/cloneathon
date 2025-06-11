import { type ReactNode, useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SwitchCard({
  title,
  description,
  icon,
  className,
  value,
  onChange
}: {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className={cn("relative flex w-full items-start gap-2", className)}>
      <div className="flex grow items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div className="grid grow gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={id}>{title}</Label>
            <Switch
              id={id}
              checked={value}
              onCheckedChange={onChange}
              className="data-[state=checked]:[&_span]:rtl:-translate-x-2 order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2"
              aria-describedby={`${id}-description`}
            />
          </div>
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
