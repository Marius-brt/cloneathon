import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { LoaderCircle, type LucideIcon } from "lucide-react";
import { type ComponentProps, type ReactNode, isValidElement } from "react";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-primary bg-linear-to-b from-primary/80 to-primary text-primary-foreground text-sm shadow-md shadow-zinc-950/30 ring ring-white/20 ring-inset transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-primary dark:from-primary dark:to-primary/80 **:[text-shadow:0_1px_0_var(--color-primary)]",
        destructive:
          "inset-shadow-2xs inset-shadow-white/25 border border-zinc-950/35 bg-linear-to-b from-destructive/85 to-destructive text-destructive-foreground shadow-md shadow-zinc-950/20 ring-0 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-0 dark:border-zinc-950/50 dark:bg-linear-to-t dark:from-destructive/75",
        outline:
          "relative flex border border-zinc-300 ring-0 duration-150 hover:bg-muted dark:border-border dark:hover:bg-muted/50",
        secondary:
          "relative inset-shadow-2xs inset-shadow-white flex border border-zinc-300 bg-muted shadow-sm shadow-zinc-950/10 ring-0 duration-150 hover:bg-background dark:inset-shadow-transparent dark:border-border dark:bg-muted/25 dark:hover:bg-muted/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  loading,
  disabled,
  icon: Icon,
  size,
  children,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    icon?: ReactNode | LucideIcon;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      disabled={loading || disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && (
        <LoaderCircle
          className="-ms-1 animate-spin"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      {Icon && !loading && (
        <div className={"-ms-1"}>
          {isValidElement(Icon) ? (
            Icon
          ) : (
            // @ts-ignore
            <Icon className={children ? "opacity-60" : ""} size={16} strokeWidth={2} />
          )}
        </div>
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
