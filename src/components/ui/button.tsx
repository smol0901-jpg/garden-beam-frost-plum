import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-pine text-pine-fg shadow-[var(--shadow-stamp)] hover:bg-moss",
        secondary:
          "bg-raised text-ink shadow-[var(--shadow-card)] hover:bg-surface",
        outline:
          "border border-line-strong bg-transparent text-ink hover:bg-raised",
        ghost: "text-ink hover:bg-ink/5",
        destructive: "bg-absent text-white hover:opacity-90",
      },
      size: {
        default: "h-11 rounded-[10px] px-4 text-sm",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-xl px-5 text-base",
        icon: "size-11 rounded-[10px]",
        stamp: "h-14 rounded-2xl px-6 text-base tracking-wide",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
