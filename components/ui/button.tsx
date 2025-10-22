import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gem-fire text-gem-bgDark shadow-primary-glow hover:bg-gem-fireLight hover:text-gem-bgDark active:bg-gem-fireDark focus-visible:ring-gem-fire/50",
        destructive:
          "bg-gem-compGreen text-gem-text hover:bg-gem-compGreen/90 focus-visible:ring-gem-compGreen/50",
        outline:
          "border border-gem-ice/70 bg-transparent text-gem-ice hover:bg-gem-ice/10 hover:text-gem-iceLight focus-visible:ring-gem-ice/50",
        secondary:
          "bg-gem-ice text-gem-bgDark shadow-secondary-glow hover:bg-gem-iceLight hover:text-gem-bgDark active:bg-gem-iceDark focus-visible:ring-gem-ice/50",
        accent:
          "bg-gem-green text-gem-bgDark hover:bg-gem-green/90 focus-visible:ring-gem-green/50",
        ghost:
          "text-gem-ice hover:text-gem-iceLight hover:bg-gem-ice/10 focus-visible:ring-gem-ice/50",
        link:
          "text-gem-ice underline-offset-4 hover:text-gem-iceLight hover:underline focus-visible:ring-gem-ice/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
