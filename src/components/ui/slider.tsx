import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * A reusable slider component built on top of Radix UI's slider primitive
 * Provides a draggable range input with customizable styling
 * 
 * Features:
 * - Customizable through className prop
 * - Maintains all Radix UI slider attributes
 * - Touch-friendly interaction
 * - Keyboard accessible
 * - Theme-aware colors
 * - Focus and disabled states
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* Track component that shows the slider's range */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      {/* Range component that shows the selected value */}
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {/* Thumb component that can be dragged to change the value */}
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
