import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './theme';
import { LanguageProvider } from './language';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter as Router } from "react-router-dom";

interface RootProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function RootProvider({ children }: RootProviderProps) {
  return (
    <Router>
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
    </Router>
  );
} 