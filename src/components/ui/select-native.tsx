import * as React from "react";
import { cn } from "@/lib/utils";

export function SelectNative({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-11 w-full appearance-none rounded-[10px] border border-line-strong bg-raised bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path fill=%22%231a2421%22 d=%22M1 1l5 5 5-5%22/>')] bg-[length:12px_8px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35",
        className,
      )}
      {...props}
    />
  );
}
