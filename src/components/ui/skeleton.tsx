import { cn } from "@/lib/utils"

/**
 * A reusable skeleton component for loading states
 * Provides a pulsing animation effect to indicate content is loading
 * 
 * Features:
 * - Customizable through className prop
 * - Pulsing animation
 * - Theme-aware background color
 * - Rounded corners
 * - Extends all HTML div attributes
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Base styles
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
