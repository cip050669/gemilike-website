import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-gem-text placeholder:text-gem-text2 selection:bg-gem-fire selection:text-gem-bgDark bg-gem-bgDark/50 border-gem-iceDark/30 h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-gem-text",
        "focus-visible:border-gem-ice focus-visible:ring-gem-ice/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-gem-compGreen/20 aria-invalid:border-gem-compGreen",
        className
      )}
      {...props}
    />
  )
}

export { Input }
