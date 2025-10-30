import * as React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminButtonProps = ButtonProps & {
  compact?: boolean
}

const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, children, compact = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={cn(
          "gem-admin-button",
          compact && "gem-admin-button--compact",
          className
        )}
      >
        <span className="gem-admin-button__content">{children}</span>
      </Button>
    )
  }
)

AdminButton.displayName = "AdminButton"

export { AdminButton }

