import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { safeFetchAll } from "@/integrations/supabase/safeFetch";
import { 
  Users, Globe, Cpu, Smartphone, Monitor, ShieldAlert,
  ChevronDown, Search, BarChart3, Database, Calendar, Wifi, HardDrive, RefreshCw
} from "lucide-react";

type VisitorLog = {
  id: string;
  ip_address: string | null;
  os: string | null;
  browser: string | null;
  location: string | null;
  user_agent: string | null;
  resolution: string | null;
  languages: string | null;
  device_memory: string | null;
  hardware_concurrency: number | null;
  gpu_renderer: string | null;
  network_type: string | null;
  touch_support: boolean | null;
  pixel_ratio: number | null;
  country: string | null;
  region: string | null;
  city: string | null;
  isp: string | null;
  created_at: string;
};

export const AnalyticsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOS, setFilterOS] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<VisitorLog | null>(null);

  const { data: logs = [], isLoading, refetch, isRefetching } = useQuery<VisitorLog[]>({
    queryKey: ["visitor_logs_full"],
    queryFn: () => safeFetchAll<VisitorLog>("visitor_logs", { order: "created_at", ascending: false })
  });

  // Aggregation Functions
  const osStats = logs.reduce((acc: Record<string, number>, log) => {
    const key = log.os || "UNKNOWN";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const browserStats = logs.reduce((acc: Record<string, number>, log) => {
    const key = log.browser || "UNKNOWN";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const countryStats = logs.reduce((acc: Record<string, number>, log) => {
    const key = log.country || "Unknown Location";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const networkStats = logs.reduce((acc: Record<string, number>, log) => {
    const key = log.network_type || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.browser?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.os?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.gpu_renderer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.isp?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOS = filterOS === "ALL" || log.os === filterOS;
    return matchesSearch && matchesOS;
  });

  const uniqueOSList = Object.keys(osStats);

  // Render Helpers
  const percentage = (val: number) => {
    if (logs.length === 0) return "0%";
    return `${Math.round((val / logs.length) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">Visitor Analytics</h3>
          <p className="text-sm text-muted-foreground">Comprehensive hardware and network telemetry stream collected from browser specifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-background-elevated transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            Sync Stream
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-primary/20 hover:border-primary/40 transition">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Logs</h4>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-display font-bold">{isLoading ? "..." : logs.length}</p>
          <span className="text-[10px] text-muted-foreground">Total unique browser sessions</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-secondary/20 hover:border-secondary/40 transition">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Countries</h4>
            <Globe className="h-4 w-4 text-secondary" />
          </div>
          <p className="text-3xl font-display font-bold">{isLoading ? "..." : Object.keys(countryStats).length}</p>
          <span className="text-[10px] text-muted-foreground">Unique geolocation nodes</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-accent/20 hover:border-accent/40 transition">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">High-DPI Ratio</h4>
            <Monitor className="h-4 w-4 text-accent" />
          </div>
          <p className="text-3xl font-display font-bold">
            {isLoading ? "..." : `${Math.round((logs.filter(l => (l.pixel_ratio || 1) > 1).length / Math.max(logs.length, 1)) * 100)}%`}
          </p>
          <span className="text-[10px] text-muted-foreground">Screens with pixel ratio &gt; 1x</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-warning/20 hover:border-warning/40 transition">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Touch Devices</h4>
            <Smartphone className="h-4 w-4 text-warning" />
          </div>
          <p className="text-3xl font-display font-bold">
            {isLoading ? "..." : `${Math.round((logs.filter(l => l.touch_support === true).length / Math.max(logs.length, 1)) * 100)}%`}
          </p>
          <span className="text-[10px] text-muted-foreground">Touch-enabled screens</span>
        </div>
      </div>

      {/* Grid: Stat Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operating Systems */}
        <div className="glass-panel rounded-xl border border-border/50 p-5 space-y-4">
          <h4 className="font-display font-bold text-sm flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" /> Operating System Shares
          </h4>
          <div className="space-y-3 pt-2">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Computing data...</div>
            ) : Object.keys(osStats).length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No data yet.</div>
            ) : (
              Object.entries(osStats).map(([os, count]) => (
                <div key={os} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{os}</span>
                    <span className="text-muted-foreground">{count} ({percentage(count)})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: percentage(count) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Browsers */}
        <div className="glass-panel rounded-xl border border-border/50 p-5 space-y-4">
          <h4 className="font-display font-bold text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-secondary" /> Browser engines
          </h4>
          <div className="space-y-3 pt-2">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Computing data...</div>
            ) : Object.keys(browserStats).length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No data yet.</div>
            ) : (
              Object.entries(browserStats).map(([browser, count]) => (
                <div key={browser} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{browser}</span>
                    <span className="text-muted-foreground">{count} ({percentage(count)})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-500" 
                      style={{ width: percentage(count) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Network & Connection */}
        <div className="glass-panel rounded-xl border border-border/50 p-5 space-y-4">
          <h4 className="font-display font-bold text-sm flex items-center gap-2">
            <Wifi className="h-4 w-4 text-accent" /> Connection Speeds
          </h4>
          <div className="space-y-3 pt-2">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Computing data...</div>
            ) : Object.keys(networkStats).length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No data yet.</div>
            ) : (
              Object.entries(networkStats).map(([net, count]) => (
                <div key={net} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground uppercase">{net} Connection</span>
                    <span className="text-muted-foreground">{count} ({percentage(count)})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500" 
                      style={{ width: percentage(count) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Table / Logs viewer */}
      <div className="glass-panel rounded-xl border border-border/50 overflow-hidden flex flex-col shadow-sm">
        {/* Table Filters */}
        <div className="p-4 border-b border-border/40 bg-background-elevated/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search IP, Location, ISP..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/60 transition"
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <label className="text-xs text-muted-foreground uppercase font-semibold">OS filter:</label>
            <div className="relative">
              <select 
                value={filterOS}
                onChange={(e) => setFilterOS(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-foreground cursor-pointer focus:border-primary/60 outline-none transition"
              >
                <option value="ALL">All Systems</option>
                {uniqueOSList.map(os => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading visitor telemetry stream...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No matching sessions found.</div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-background-elevated/40 text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="p-4">Time</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Browser & OS</th>
                  <th className="p-4">Hardware Specs</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-background-elevated/30 transition-colors">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                      {new Date(log.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="p-4 font-mono text-foreground font-medium">{log.ip_address || "unknown"}</td>
                    <td className="p-4">
                      <div className="font-medium">{log.location || "unknown"}</div>
                      <div className="text-[10px] text-muted-foreground max-w-[180px] truncate" title={log.isp || ""}>
                        {log.isp || "unknown ISP"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{log.os || "unknown"}</div>
                      <div className="text-[10px] text-muted-foreground">{log.browser || "unknown"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-foreground">
                        {log.resolution ? `${log.resolution}` : "unknown res"} ({(log.pixel_ratio || 1).toFixed(1)}x)
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <span>CPU: {log.hardware_concurrency || "?"} cores</span>
                        <span>·</span>
                        <span>RAM: {log.device_memory || "?"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-2 py-1 hover:bg-primary/5 rounded"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Inspect Telemetry Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />
          <div className="relative glass-panel rounded-2xl border border-border w-full max-w-xl max-h-[85vh] overflow-y-auto flex flex-col p-6 shadow-2xl animate-in scale-in duration-300">
            <div className="flex justify-between items-start mb-6 border-b border-border/40 pb-4">
              <div>
                <h4 className="text-base font-display font-semibold text-foreground">Device Inspection Info</h4>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{selectedLog.id}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-background-elevated px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-elevated/40 border border-border/30 rounded-lg p-3">
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">IP Address</div>
                  <div className="font-mono text-foreground font-semibold">{selectedLog.ip_address}</div>
                </div>
                <div className="bg-background-elevated/40 border border-border/30 rounded-lg p-3">
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Timezone</div>
                  <div className="font-mono text-foreground font-semibold">{selectedLog.location?.split(',')[0]}</div>
                </div>
              </div>

              <div className="bg-background-elevated/40 border border-border/30 rounded-lg p-3 space-y-2.5">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5 border-b border-border/20 pb-1 flex items-center gap-1.5">
                  <Monitor className="h-3 w-3 text-primary" /> Visuals & Screen Specs
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[9px] text-muted-foreground">Resolution</div>
                    <div className="font-semibold">{selectedLog.resolution || "unknown"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground">Pixel Ratio</div>
                    <div className="font-semibold">{selectedLog.pixel_ratio || 1}x</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground">Touch Support</div>
                    <div className="font-semibold">{selectedLog.touch_support ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>
              </div>

              <div className="bg-background-elevated/40 border border-border/30 rounded-lg p-3 space-y-2.5">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5 border-b border-border/20 pb-1 flex items-center gap-1.5">
                  <Cpu className="h-3 w-3 text-secondary" /> Hardware Performance
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[9px] text-muted-foreground">CPU Core Thread</div>
                    <div className="font-semibold">{selectedLog.hardware_concurrency || "unknown"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground">Device Memory</div>
                    <div className="font-semibold">{selectedLog.device_memory || "unknown"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground">Network connection</div>
                    <div className="font-semibold uppercase">{selectedLog.network_type || "unknown"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground">Graphics card GPU Renderer</div>
                  <div className="font-mono text-[10px] break-all">{selectedLog.gpu_renderer || "unknown"}</div>
                </div>
              </div>

              <div className="bg-background-elevated/40 border border-border/30 rounded-lg p-3 space-y-2.5">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5 border-b border-border/20 pb-1 flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-accent" /> Network Carrier & ISP
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[9px] text-muted-foreground">Internet Provider ISP</div>
                    <div className="font-medium text-foreground">{selectedLog.isp || "unknown"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground">Preferred Langs</div>
                    <div className="font-medium text-foreground truncate" title={selectedLog.languages || ""}>
                      {selectedLog.languages || "unknown"}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground">Full User Agent</div>
                  <div className="font-mono text-[10px] break-all text-muted-foreground/80 mt-1 leading-relaxed bg-[#020202] p-2 rounded border border-border/10">
                    {selectedLog.user_agent || "unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
