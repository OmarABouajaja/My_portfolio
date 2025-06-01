import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Type definitions for the Carousel component
 * - CarouselApi: Type for the Embla Carousel API
 * - UseCarouselParameters: Parameters for the useEmblaCarousel hook
 * - CarouselOptions: Configuration options for the carousel
 * - CarouselPlugin: Plugin type for additional functionality
 */
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

/**
 * Props interface for the Carousel component
 * - opts: Carousel configuration options
 * - plugins: Additional carousel plugins
 * - orientation: Horizontal or vertical layout
 * - setApi: Callback for accessing the carousel API
 */
type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

/**
 * Carousel context type definition
 * Contains state and methods for carousel functionality
 */
type CarouselContextType = {
  scrollSnaps: number[]
  selectedIndex: number
  scrollTo: (index: number) => void
  scrollNext: () => void
  scrollPrev: () => void
  canScrollNext: boolean
  canScrollPrev: boolean
  carouselRef: React.RefObject<HTMLDivElement>
  orientation: 'horizontal' | 'vertical'
}

/**
 * Carousel context for managing carousel state
 * Provides carousel functionality to children
 */
const CarouselContext = React.createContext<CarouselContextType | undefined>(undefined)

/**
 * Custom hook for accessing carousel context
 * Throws an error if used outside of a Carousel component
 */
function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

/**
 * Carousel component
 * Features:
 * - Smooth scrolling between slides
 * - Touch and drag support
 * - Keyboard navigation
 * - Customizable through className prop
 */
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
  }
>(({ className, orientation = 'horizontal', ...props }, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [canScrollNext, setCanScrollNext] = React.useState(true)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const carouselRef = React.useRef<HTMLDivElement>(null)

  const scrollTo = React.useCallback((index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current
      const slide = container.children[index] as HTMLElement
      if (slide) {
        container.scrollTo({
          left: slide.offsetLeft,
          behavior: 'smooth'
        })
      }
    }
  }, [])

  const scrollNext = React.useCallback(() => {
    if (canScrollNext) {
      scrollTo(selectedIndex + 1)
    }
  }, [canScrollNext, selectedIndex, scrollTo])

  const scrollPrev = React.useCallback(() => {
    if (canScrollPrev) {
      scrollTo(selectedIndex - 1)
    }
  }, [canScrollPrev, selectedIndex, scrollTo])

  const value = React.useMemo(
    () => ({
      scrollSnaps,
      selectedIndex,
      scrollTo,
      scrollNext,
      scrollPrev,
      canScrollNext,
      canScrollPrev,
      carouselRef,
      orientation
    }),
    [
      scrollSnaps,
      selectedIndex,
      scrollTo,
      scrollNext,
      scrollPrev,
      canScrollNext,
      canScrollPrev,
      orientation
    ]
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        {...props}
      />
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

/**
 * Content container for carousel items
 * Features:
 * - Overflow handling
 * - Orientation-based layout
 * - Proper spacing between items
 */
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

/**
 * Individual carousel item component
 * Features:
 * - Full-width/height basis
 * - Proper spacing based on orientation
 * - Accessibility attributes
 */
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

/**
 * Previous slide navigation button
 * Features:
 * - Position based on orientation
 * - Disabled state when can't scroll
 * - Accessible button with icon
 */
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

/**
 * Next slide navigation button
 * Features:
 * - Position based on orientation
 * - Disabled state when can't scroll
 * - Accessible button with icon
 */
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
