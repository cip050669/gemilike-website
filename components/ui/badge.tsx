import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gem-fire/40 bg-gem-fire/20 text-gem-fire focus:ring-gem-fire/50",
        secondary:
          "border-gem-ice/40 bg-gem-ice/20 text-gem-ice focus:ring-gem-ice/50",
        destructive:
          "border-gem-compGreen/40 bg-gem-compGreen/20 text-gem-compGreen focus:ring-gem-compGreen/50",
        accent:
          "border-gem-green/40 bg-gem-green/20 text-gem-green focus:ring-gem-green/50",
        outline:
          "border-gem-ice/25 bg-transparent text-gem-text hover:bg-gem-ice/10 focus:ring-gem-ice/50",
        ice:
          "border-gem-ice/50 bg-gem-ice/20 text-gem-ice focus:ring-gem-ice/50",
        fire:
          "border-gem-fire/50 bg-gem-fire/20 text-gem-fire focus:ring-gem-fire/50",
        purple:
          "border-gem-purple/50 bg-gem-purple/20 text-gem-purple focus:ring-gem-purple/50",
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
