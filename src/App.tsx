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
import { CustomCursor } from "@/components/CustomCursor";
import { CommandMenu } from "@/components/CommandMenu";

const queryClient = new QueryClient();

const ThemeInit = () => {
  useThemeEngine();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeInit />
    <TooltipProvider>
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* CommandMenu lives inside BrowserRouter so useLocation works */}
        <CommandMenu />
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
