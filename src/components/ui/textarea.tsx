import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Props interface for the Textarea component
 * Extends the native HTML textarea attributes
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * A reusable textarea component with consistent styling and accessibility features
 * 
 * Features:
 * - Customizable through className prop
 * - Maintains all native textarea attributes
 * - Minimum height for better usability
 * - Focus and disabled states
 * - Placeholder styling
 * - Theme-aware colors
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          // Focus and ring styles
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Placeholder and disabled states
          "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
