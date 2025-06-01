import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * A reusable switch component built on top of Radix UI's switch primitive
 * Provides a toggle input with customizable styling
 * 
 * Features:
 * - Customizable through className prop
 * - Maintains all Radix UI switch attributes
 * - Smooth transition animations
 * - Keyboard accessible
 * - Theme-aware colors
 * - Focus and disabled states
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base styles
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
      // Transition and focus states
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Checked and unchecked states
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    {/* Thumb component that slides between states */}
    <SwitchPrimitives.Thumb
      className={cn(
        // Base styles
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
        // Transition and position states
        "transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
