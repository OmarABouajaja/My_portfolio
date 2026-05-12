import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Search, LayoutDashboard, Database, Layers, Cpu, Share2, 
  Smartphone, DollarSign, FileText, MessageSquare, Star, 
  Activity, BookOpen, Terminal, HardDrive, Settings, LogOut, Palette
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useThemeEngine } from "@/hooks/useThemeEngine";

interface Props {
  setActiveTab: (tab: string) => void;
}

export const AdminCommandPalette = ({ setActiveTab }: Props) => {
  const [open, setOpen] = useState(false);
  const { themes, applyTheme, currentTheme } = useThemeEngine();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const handleThemeCycle = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    applyTheme(themes[nextIndex]);
    setOpen(false);
    toast.success(`Theme switched to ${themes[nextIndex]}`);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search admin modules..." />
        <CommandList>
          <CommandEmpty>No modules found.</CommandEmpty>
          
          <CommandGroup heading="Actions">
            <CommandItem onSelect={handleThemeCycle}>
              <Palette className="mr-2 h-4 w-4 text-accent" />
              <span>Cycle OS Theme</span>
            </CommandItem>
            <CommandItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-destructive" />
              <span>Lock OS (Logout)</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />

          <CommandGroup heading="Core Modules">
            <CommandItem onSelect={() => navigateTo("overview")}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("projects")}>
              <Database className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("skills")}>
              <Layers className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Stack</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Ecosystem & Freelance">
            <CommandItem onSelect={() => navigateTo("iot")}>
              <Cpu className="mr-2 h-4 w-4 text-secondary" />
              <span>Go to IoT Fleet</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("localdrop")}>
              <Share2 className="mr-2 h-4 w-4 text-accent" />
              <span>Go to LocalDrop</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("invoices")}>
              <FileText className="mr-2 h-4 w-4 text-success" />
              <span>Go to Invoices</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("contact")}>
              <MessageSquare className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Inbox</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="System & Personal">
            <CommandItem onSelect={() => navigateTo("lifeos")}>
              <Activity className="mr-2 h-4 w-4 text-secondary" />
              <span>Go to Life OS</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("vault")}>
              <Terminal className="mr-2 h-4 w-4 text-success" />
              <span>Go to Cmd Vault</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("storage")}>
              <HardDrive className="mr-2 h-4 w-4 text-warning" />
              <span>Go to DB & Storage</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("settings")}>
              <Settings className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
