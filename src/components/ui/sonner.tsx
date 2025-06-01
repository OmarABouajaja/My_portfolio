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
  let theme: Theme = "light";
  
  try {
    // Get the current theme from the theme context
    const { theme: currentTheme } = useTheme();
    theme = currentTheme;
  } catch (error) {
    // Handle errors if the theme context is unavailable
    console.error('Error accessing theme context:', error);
    return null;
  }

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
