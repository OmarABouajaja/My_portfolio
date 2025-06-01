import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './theme';
import { LanguageProvider } from './language';
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function AppProviders({ children }: AppProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <ThemeProvider>
                <LanguageProvider>
                  <TooltipProvider>
                    {children}
                  </TooltipProvider>
                </LanguageProvider>
              </ThemeProvider>
            </HelmetProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider>
            <LanguageProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </LanguageProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
} 