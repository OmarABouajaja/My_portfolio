import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import React from "react"

type CarouselApi = UseEmblaCarouselType[1]

type CarouselProps = {
  orientation?: "horizontal" | "vertical"
  opts?: Parameters<typeof useEmblaCarousel>[0]
  plugins?: Parameters<typeof useEmblaCarousel>[1]
  setApi?: (api: CarouselApi) => void
  className?: string
  children?: React.ReactNode
}

export type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement>
  api: CarouselApi | undefined
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (context === null) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ orientation = "horizontal", opts, plugins, setApi, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      setCanScrollPrev(api?.canScrollPrev() ?? false)
      setCanScrollNext(api?.canScrollNext() ?? false)
  }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

  const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api) {
        return
      }

      setApi?.(api)
      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
    }
    }, [api, onSelect, setApi])

    return (
      <CarouselContext.Provider
        value={React.useMemo(
    () => ({
            carouselRef: carouselRef as unknown as React.RefObject<HTMLDivElement>,
            api,
            scrollPrev,
      scrollNext,
            canScrollPrev,
      canScrollNext,
          }),
          [api, canScrollPrev, canScrollNext, carouselRef, scrollNext, scrollPrev]
        )}
      >
      <div
        ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          <div
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div
        className={cn(
                "flex",
                orientation === "horizontal" ? "-ml-4" : "-mt-4",
                orientation === "horizontal" ? "flex-row" : "flex-col"
              )}
            >
              {children}
            </div>
          </div>
        </div>
    </CarouselContext.Provider>
  )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
      <div
        ref={ref}
      className={cn("flex", "-ml-4", className)}
        {...props}
      />
  )
)
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", "ml-4", className)}
      {...props}
    />
  )
)
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>((
  { className, ...props },
  ref
) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      ref={ref}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        "-left-12 top-1/2 -translate-y-1/2",
        canScrollPrev ? "" : "invisible",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>((
  { className, ...props },
  ref
) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      ref={ref}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        "-right-12 top-1/2 -translate-y-1/2",
        canScrollNext ? "" : "invisible",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="w-4 h-4" />
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
  type CarouselApi
}
