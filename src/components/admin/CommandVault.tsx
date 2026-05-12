import { useState } from "react";
import { Terminal, Copy, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

type Snippet = { id: number; title: string; command: string; category: string };

export const CommandVault = () => {
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>("bo3_command_vault", [
    { id: 1, title: "Flash ESP32 (Web)", command: "esptool.py --port /dev/ttyUSB0 --baud 115200 write_flash -z 0x1000 firmware.bin", category: "IoT" },
    { id: 2, title: "Start Local Supabase", command: "supabase start && supabase status", category: "Backend" },
    { id: 3, title: "Docker Nuke", command: "docker system prune -a --volumes", category: "System" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newCommand, setNewCommand] = useState("");
  const [newCategory, setNewCategory] = useState("IoT");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const addSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCommand.trim()) return;
    setSnippets([{ id: Date.now(), title: newTitle, command: newCommand, category: newCategory }, ...snippets]);
    setNewTitle("");
    setNewCommand("");
  };

  const removeSnippet = (id: number) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const copyToClipboard = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Command copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Command Form */}
      <div className="glass-panel rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
          <Terminal className="w-5 h-5" /> Save New Command
        </h3>
        <form onSubmit={addSnippet} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Snippet Title" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="md:col-span-1 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
          />
          <input 
            type="text" 
            placeholder="sudo npm run..." 
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
            className="md:col-span-2 bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono text-success focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-2">
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-background-elevated border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="IoT">IoT / Hardware</option>
              <option value="Backend">Backend / DB</option>
              <option value="Frontend">Frontend</option>
              <option value="System">System / OS</option>
            </select>
            <button type="submit" className="bg-primary/20 text-primary p-2 rounded-lg hover:bg-primary/30 transition">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Vault List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {snippets.map(snippet => (
          <div key={snippet.id} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-cyber opacity-0 group-hover:opacity-10 rounded-xl blur transition duration-500" />
            <div className="bg-[#050505] rounded-xl border border-border/50 overflow-hidden relative shadow-elevated h-full flex flex-col transition-colors duration-300 group-hover:border-primary/30">
              
              {/* macOS Window Controls */}
              <div className="bg-background-elevated/40 border-b border-border/40 px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-warning/80 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-success/80 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2 truncate px-4">
                  <span className="text-primary truncate">{snippet.category}</span>
                  <span className="opacity-50">/</span>
                  <span className="truncate">{snippet.title}</span>
                </div>
                <button 
                  onClick={() => removeSnippet(snippet.id)}
                  className="text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Terminal Body */}
              <div className="p-5 flex items-center justify-between gap-4 flex-1">
                <div className="flex items-start gap-3 overflow-hidden">
                  <span className="text-primary text-sm font-mono select-none mt-0.5">~%</span>
                  <code className="text-sm text-foreground/90 font-mono break-all line-clamp-3 select-all">
                    {snippet.command}
                  </code>
                </div>
                
                <button 
                  onClick={() => copyToClipboard(snippet.id, snippet.command)}
                  className={`shrink-0 p-2.5 rounded-lg transition-all duration-300 border ${
                    copiedId === snippet.id 
                      ? 'bg-success/20 text-success border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-background-elevated border-border hover:border-primary/50 text-muted-foreground hover:text-primary'
                  }`}
                >
                  {copiedId === snippet.id ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
