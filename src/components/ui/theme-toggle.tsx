import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

/**
 * ThemeToggle component that allows users to switch between light and dark themes
 * Features:
 * - Smooth icon transition animations
 * - Hover and tap animations
 * - Accessible button with aria-label
 * - Uses next-themes for theme management
 */
export function ThemeToggle() {
  // Get current theme and theme setter from next-themes
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      // Hover and tap animations for better interactivity
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative p-2 rounded-full bg-background hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {/* Sun icon with rotation and scale animations */}
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : 180,
          scale: theme === "light" ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      {/* Moon icon with rotation and scale animations */}
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 0 : -180,
          scale: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
    </motion.button>
  );
} 