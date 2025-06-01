import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * A reusable separator component built on top of Radix UI's separator primitive
 * Provides a visual divider that can be used to separate content
 * 
 * Features:
 * - Supports both horizontal and vertical orientations
 * - Customizable through className prop
 * - Maintains all Radix UI separator attributes
 * - Can be decorative or semantic
 * - Responsive to theme colors
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // Base styles
        "shrink-0 bg-border",
        // Orientation-specific dimensions
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
