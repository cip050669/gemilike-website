import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/40 bg-primary-soft text-primary focus:ring-primary-focus",
        secondary:
          "border-secondary/40 bg-secondary-soft text-secondary-foreground focus:ring-secondary-focus",
        destructive:
          "border-destructive/40 bg-destructive/20 text-destructive-foreground focus:ring-destructive",
        accent:
          "border-accent/40 bg-accent-soft text-accent-foreground focus:ring-primary-focus",
        outline:
          "border-white/25 bg-transparent text-foreground hover:bg-white/10 focus:ring-primary-focus",
        ice:
          "border-secondary/50 bg-secondary/20 text-secondary-foreground focus:ring-secondary-focus",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
