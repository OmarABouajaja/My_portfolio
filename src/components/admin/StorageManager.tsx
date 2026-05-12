import { useState, useEffect, useCallback, useRef } from "react";
import { Database, HardDrive, Download, Upload, Trash2, RefreshCw, Server, AlertTriangle, FileJson, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { hasSupabase } from "@/integrations/supabase/safeFetch";

type StorageItem = {
  key: string;
  size: number;
  parsedSize: string;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getStorageKeyName = (key: string) => {
  const mapping: Record<string, string> = {
    'bo3_device_matrix': 'Device Matrix',
    'bo3_localdrop_history': 'LocalDrop Transfers',
    'bo3_iot_nodes': 'IoT Fleet Nodes',
    'bo3_finance_tx': 'Finance Transactions',
    'bo3_finance_goal': 'Finance Goal',
    'bo3_focus_tasks': 'Focus Tasks',
    'bo3_bridge_config': 'Bridge Relay Config',
    'bo3_device_notifs': 'Device Notifications',
    'bo3_commands': 'Command Vault',
    'bo3_lifeos_habits': 'Life OS Habits',
    'bo3_lifeos_routines': 'Life OS Routines',
  };
  return mapping[key] || key.replace('bo3_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const StorageManager = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [totalUsed, setTotalUsed] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const STORAGE_LIMIT = 5 * 1024 * 1024; // Typical browser limit is 5MB

  const scanStorage = useCallback(() => {
    setIsRefreshing(true);
    let total = 0;
    const scannedItems: StorageItem[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('bo3_')) {
        const value = localStorage.getItem(key) || '';
        // Calculate byte size (UTF-16 strings take 2 bytes per char)
        const size = value.length * 2;
        total += size;
        scannedItems.push({
          key,
          size,
          parsedSize: formatBytes(size)
        });
      }
    }

    scannedItems.sort((a, b) => b.size - a.size);
    setItems(scannedItems);
    setTotalUsed(total);

    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  useEffect(() => {
    scanStorage();
  }, [scanStorage]);

  const handleExport = () => {
    try {
      const data: Record<string, any> = {};
      items.forEach(item => {
        const val = localStorage.getItem(item.key);
        if (val) {
          try {
            data[item.key] = JSON.parse(val);
          } catch {
            data[item.key] = val;
          }
        }
      });

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `abouajaja_omar_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Backup exported successfully");
    } catch (error) {
      toast.error("Failed to export backup");
      console.error(error);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        let importedCount = 0;
        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith('bo3_')) {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            importedCount++;
          }
        });

        scanStorage();
        toast.success(`Restored ${importedCount} modules from backup`);
        
        // Force reload to let other modules re-initialize from storage
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } catch (error) {
        toast.error("Invalid backup file format");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteItem = (key: string) => {
    if (confirm(`Are you sure you want to delete ${getStorageKeyName(key)} data?`)) {
      localStorage.removeItem(key);
      scanStorage();
      toast.success(`Cleared ${getStorageKeyName(key)}`);
    }
  };

  const handleFactoryReset = () => {
    if (confirm("WARNING: This will permanently delete ALL local app data. You cannot undo this unless you have exported a backup. Type 'RESET' to confirm.")) {
      const confirmation = prompt("Type 'RESET' to confirm factory reset:");
      if (confirmation === 'RESET') {
        items.forEach(item => localStorage.removeItem(item.key));
        scanStorage();
        toast.success("Factory reset complete");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.info("Reset cancelled");
      }
    }
  };

  const usagePercentage = Math.min((totalUsed / STORAGE_LIMIT) * 100, 100);

  return (
    <div className="space-y-6">
      {/* ── Status Header ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-primary/20 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" /> Local Storage Metrics
            </h3>
            <button
              onClick={scanStorage}
              disabled={isRefreshing}
              className={`p-1.5 rounded-md text-muted-foreground hover:bg-background-elevated transition ${isRefreshing ? "animate-spin text-primary" : ""}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-display font-bold text-foreground">
                  {formatBytes(totalUsed)}
                </div>
                <div className="text-sm text-muted-foreground mt-1 uppercase tracking-widest">
                  Used of {formatBytes(STORAGE_LIMIT)} Limit
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-display text-primary">
                  {usagePercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Storage Progress Bar */}
            <div className="h-3 w-full bg-background-elevated rounded-full overflow-hidden border border-border/50 relative">
              <div 
                className={`h-full transition-all duration-1000 ease-out relative ${
                  usagePercentage > 90 ? 'bg-destructive' : usagePercentage > 75 ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${usagePercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* ── Cloud Sync Status ── */}
        <div className={`glass-panel p-6 rounded-xl border ${hasSupabase ? "border-success/20" : "border-warning/20"}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Server className={`w-4 h-4 ${hasSupabase ? "text-success" : "text-warning"}`} /> 
            Cloud Sync
          </h3>
          <div className="flex flex-col items-center justify-center text-center py-4">
            {hasSupabase ? (
              <>
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div className="text-foreground font-medium mb-1">Supabase Connected</div>
                <div className="text-xs text-muted-foreground">Core projects and messages sync automatically.</div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4 relative">
                  <AlertTriangle className="w-8 h-8 text-warning" />
                  <span className="absolute top-2 right-2 w-3 h-3 bg-warning rounded-full animate-ping" />
                </div>
                <div className="text-foreground font-medium mb-1">Mock Mode Active</div>
                <div className="text-xs text-muted-foreground">Operating entirely offline. Changes will not persist to cloud.</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Data Breakdown ── */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" /> Data Breakdown
            </h3>
            <span className="text-[10px] text-muted-foreground bg-background-elevated px-2 py-1 rounded-md uppercase tracking-wider font-bold">
              {items.length} Modules
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {items.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
                No local data found.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.key} className="group flex items-center justify-between p-3 rounded-lg bg-background-elevated/30 border border-border/50 hover:border-accent/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 text-accent rounded-md">
                      <FileJson className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground/90">{getStorageKeyName(item.key)}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.key}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-medium">{item.parsedSize}</span>
                    <button
                      onClick={() => handleDeleteItem(item.key)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition"
                      title="Clear Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Operations ── */}
        <div className="glass-panel rounded-xl p-6 border border-border h-fit flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> Operations
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleExport}
                disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-2 p-3 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 hover:border-primary/50 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Export Backup (JSON)
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full flex items-center justify-center gap-2 p-3 bg-accent/10 text-accent rounded-lg border border-accent/20 hover:bg-accent/20 hover:border-accent/50 transition font-medium text-sm">
                  <Upload className="w-4 h-4" /> Restore from Backup
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center leading-relaxed">
              Backups include all offline-first configuration: Devices, Drop History, Finance, IoT Nodes, and Tasks.
            </p>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <button
              onClick={handleFactoryReset}
              className="w-full flex items-center justify-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 hover:bg-destructive/20 hover:border-destructive/50 transition font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" /> Factory Reset
            </button>
            <p className="text-[10px] text-muted-foreground mt-3 text-center leading-relaxed">
              Wipes all local application state. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
