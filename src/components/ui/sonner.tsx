import { useTheme, Theme } from "@/providers/theme"
import { Toaster as Sonner } from "sonner"

// Type definition for Toaster component props, extending Sonner's props
type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toaster component that provides global toast notifications
 * Features:
 * - Integrates with the app's theme (light/dark)
 * - Customizes toast appearance using Tailwind CSS classes
 * - Handles errors accessing the theme context gracefully
 */
export function Toaster({ ...props }: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Toast container styling
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          // Description text styling
          description: "group-[.toast]:text-muted-foreground",
          // Action button styling
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          // Cancel button styling
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}
