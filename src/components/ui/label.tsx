import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Base styles for the label component using class-variance-authority
 * Includes styles for disabled state when used with form controls
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * A reusable label component built on top of Radix UI's label primitive
 * Provides consistent styling and accessibility features for form labels
 * 
 * Features:
 * - Customizable through className prop
 * - Maintains all Radix UI label attributes
 * - Responsive to disabled state of associated form controls
 * - Supports variant styling through class-variance-authority
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
