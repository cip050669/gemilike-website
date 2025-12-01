import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-[var(--font-button-size)] font-[var(--font-button-weight)] transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[#0B0F14] shadow-primary-glow hover:bg-[var(--color-accent-strong)] hover:scale-[1.02] hover:shadow-[0_0_26px_rgba(125,58,237,0.45)] active:scale-100 focus-visible:ring-[var(--color-accent-strong)]",
        destructive:
          "bg-[#ef4444] text-[#0B0F14] hover:bg-[#f87171] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] focus-visible:ring-[#f87171]",
        outline:
          "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] focus-visible:ring-[var(--color-border-strong)]",
        secondary:
          "bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)]",
        accent:
          "bg-[var(--color-accent-warm)] text-[#0B0F14] hover:bg-[#ffad73] hover:shadow-[0_0_20px_rgba(255,148,71,0.4)] focus-visible:ring-[var(--color-accent-warm)]",
        ghost:
          "text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] focus-visible:ring-[var(--color-border-strong)]",
        link:
          "text-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent-strong)] hover:underline focus-visible:ring-[var(--color-border-strong)]",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
