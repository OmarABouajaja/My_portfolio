import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme';
import { LanguageProvider } from '@/providers/language';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { router } from '@/routes';
import LoadingScreen from '@/components/LoadingScreen';

const App = () => {
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
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
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
