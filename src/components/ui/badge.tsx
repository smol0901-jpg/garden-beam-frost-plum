import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        default: "bg-ink/8 text-ink",
        pine: "bg-pine/12 text-pine",
        present: "bg-present/12 text-present",
        late: "bg-late/12 text-late",
        absent: "bg-absent/12 text-absent",
        muted: "bg-ink/6 text-muted",
        warn: "bg-warn/12 text-warn",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
