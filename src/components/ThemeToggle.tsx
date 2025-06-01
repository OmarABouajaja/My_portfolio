import { useTheme } from '@/providers/theme'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

/**
 * ThemeToggle component that allows users to switch between light and dark themes
 * @param {string} [className] - Optional CSS class name for styling
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-9 px-0"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 