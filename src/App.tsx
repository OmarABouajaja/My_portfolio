import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import ClientPortal from "./pages/ClientPortal.tsx";

import { useThemeEngine } from "@/hooks/useThemeEngine";

const queryClient = new QueryClient();

const ThemeInit = () => {
  useThemeEngine();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeInit />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/demo" element={<Admin isDemoRoute={true} />} />
          <Route path="/client" element={<ClientPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
