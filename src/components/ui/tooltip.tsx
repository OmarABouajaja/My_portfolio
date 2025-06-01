import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * Re-exported Radix UI Tooltip components with enhanced styling and accessibility
 * Each component is built on top of Radix UI primitives with consistent styling
 */

// Provider component that manages tooltip state and context
const TooltipProvider = TooltipPrimitive.Provider

// Root component that wraps the tooltip trigger and content
const Tooltip = TooltipPrimitive.Root

// Trigger component that activates the tooltip on hover/focus
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Content component that displays the tooltip message
 * Features:
 * - Customizable through className prop
 * - Default side offset of 4 units
 * - Smooth animations for enter/exit
 * - Direction-aware slide animations
 * - Consistent styling with other UI components
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Base styles
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      // Animation states
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      // Direction-aware animations
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
