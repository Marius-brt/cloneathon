import type { CSSProperties, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export function ShinyText({
  children,
  className,
  shimmerWidth = 100,
  ...props
}: AnimatedShinyTextProps) {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`
        } as CSSProperties
      }
      className={cn(
        "text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        "bg-gradient-to-r from-transparent via-50% via-black/80 to-transparent dark:via-white/80",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
