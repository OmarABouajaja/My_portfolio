import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme'; // Provides theme context (light/dark)
import { LanguageProvider } from '@/providers/language'; // Provides language context
import { Toaster } from '@/components/ui/toaster'; // App toast notifications
import { Toaster as Sonner } from '@/components/ui/sonner'; // Additional toast notifications
import { router } from '@/routes'; // App routes
import LoadingScreen from '@/components/LoadingScreen'; // Initial loading screen

const App = () => {
  // Track loading state for splash/loading screen
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate any necessary initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          {/* Show loading screen on initial load */}
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {/* Main app router and notifications */}
              <RouterProvider router={router} />
              <Toaster />
              <Sonner />
            </>
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
