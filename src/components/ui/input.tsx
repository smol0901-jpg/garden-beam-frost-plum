import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[10px] border border-line-strong bg-raised px-3 text-sm text-ink shadow-[inset_0_1px_0_rgba(26,36,33,0.04)] placeholder:text-subtle",
        "transition-[box-shadow,border-color] duration-150 ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35 focus-visible:border-pine/40",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
