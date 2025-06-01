import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A reusable input component that extends the native HTML input element
 * with consistent styling and enhanced accessibility features.
 * 
 * Features:
 * - Customizable through className prop
 * - Maintains all native input attributes
 * - Responsive text sizing
 * - Focus and disabled states
 * - File input styling
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
          // Focus and ring styles
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // File input specific styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder and disabled states
          "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          // Responsive text size
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
