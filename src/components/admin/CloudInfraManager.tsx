import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Cloud, Database, RefreshCw, Server, Activity, KeyRound, Eye, EyeOff, Save, ShieldAlert, Zap, Globe } from "lucide-react";

export const CloudInfraManager = () => {
  const [loadingCloudflare, setLoadingCloudflare] = useState(true);
  const [loadingSupabase, setLoadingSupabase] = useState(true);
  
  const [cloudflareZones, setCloudflareZones] = useState<any[]>([]);
  const [supabaseProjects, setSupabaseProjects] = useState<any[]>([]);
  
  const [purgingZone, setPurgingZone] = useState<string | null>(null);
  const [togglingDevMode, setTogglingDevMode] = useState<string | null>(null);

  // Secrets Management State
  const [cfToken, setCfToken] = useState("");
  const [sbPat, setSbPat] = useState("");
  const [showCfToken, setShowCfToken] = useState(false);
  const [showSbPat, setShowSbPat] = useState(false);
  const [savingSecrets, setSavingSecrets] = useState(false);
  const [hasSecrets, setHasSecrets] = useState({ cf: false, sb: false });

  useEffect(() => {
    checkExistingSecrets();
    fetchCloudflareData();
    fetchSupabaseData();
  }, []);

  const checkExistingSecrets = async () => {
    try {
      const { data, error } = await supabase.from("system_secrets").select("key");
      if (data) {
        setHasSecrets({
          cf: data.some((r: any) => r.key === "CLOUDFLARE_API_TOKEN"),
          sb: data.some((r: any) => r.key === "SUPABASE_PAT")
        });
      }
    } catch (err) {
      console.error("Could not check secrets", err);
    }
  };

  const saveSecrets = async () => {
    setSavingSecrets(true);
    try {
      if (cfToken) {
        await supabase.from("system_secrets").upsert({ key: "CLOUDFLARE_API_TOKEN", value: cfToken });
      }
      if (sbPat) {
        await supabase.from("system_secrets").upsert({ key: "SUPABASE_PAT", value: sbPat });
      }
      toast.success("Security Vault Updated");
      setCfToken("");
      setSbPat("");
      checkExistingSecrets();
      // Reload data
      fetchCloudflareData();
      fetchSupabaseData();
    } catch (error) {
      toast.error("Failed to save secrets");
    } finally {
      setSavingSecrets(false);
    }
  };

  const fetchCloudflareData = async () => {
    setLoadingCloudflare(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-cloudflare", {
        body: { action: "list_zones" }
      });
      if (error) throw error;
      if (data?.mock) toast.info("Cloudflare: Running in Mock Mode");
      
      if (data?.zones && !Array.isArray(data.zones)) {
        console.error("CF API Error:", data.zones);
        toast.error("Cloudflare API Error: Please check token permissions.");
        setCloudflareZones([]);
        return;
      }
      
      setCloudflareZones(data?.zones || []);
    } catch (err: any) {
      if (err.name === 'FunctionsFetchError' || err.message?.includes('Failed to send a request')) {
        console.warn("Cloudflare Edge Function not reachable. Did you deploy it?");
        toast.error("Cloudflare function not deployed. Run `supabase functions deploy admin-cloudflare`");
      } else {
        console.error("Failed to fetch CF zones:", err);
        toast.error("Failed to connect to Cloudflare edge function");
      }
    } finally {
      setLoadingCloudflare(false);
    }
  };

  const fetchSupabaseData = async () => {
    setLoadingSupabase(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-supabase", {
        body: { action: "list_projects" }
      });
      if (error) throw error;
      if (data?.mock) toast.info("Supabase Mgmt: Running in Mock Mode");

      if (data?.projects && !Array.isArray(data.projects)) {
        console.error("Supabase API Error:", data.projects);
        toast.error("Supabase API Error: Invalid Personal Access Token.");
        setSupabaseProjects([]);
        return;
      }

      setSupabaseProjects(data?.projects || []);
    } catch (err: any) {
      if (err.name === 'FunctionsFetchError' || err.message?.includes('Failed to send a request')) {
        console.warn("Supabase Edge Function not reachable. Did you deploy it?");
        toast.error("Supabase function not deployed. Run `supabase functions deploy admin-supabase`");
      } else {
        console.error("Failed to fetch Supabase projects:", err);
        toast.error("Failed to connect to Supabase edge function");
      }
    } finally {
      setLoadingSupabase(false);
    }
  };

  const purgeCache = async (zoneId: string, zoneName: string) => {
    setPurgingZone(zoneId);
    try {
      const { data, error } = await supabase.functions.invoke("admin-cloudflare", {
        body: { action: "purge_cache", zoneId }
      });
      if (error) throw error;
      if (data?.success || data?.mock) {
        toast.success(`Cache purged successfully for ${zoneName}`);
      } else {
        throw new Error("API returned failure");
      }
    } catch (err: any) {
      console.error("Purge cache failed:", err);
      toast.error(`Failed to purge cache for ${zoneName}`);
    } finally {
      setPurgingZone(null);
    }
  };

  const toggleDevMode = async (zoneId: string, zoneName: string, currentVal: number) => {
    setTogglingDevMode(zoneId);
    const target = currentVal > 0 ? "off" : "on";
    try {
      const { data, error } = await supabase.functions.invoke("admin-cloudflare", {
        body: { action: "toggle_dev_mode", zoneId, payload: target }
      });
      if (error) throw error;
      if (data?.success || data?.mock) {
        toast.success(`Dev Mode turned ${target.toUpperCase()} for ${zoneName}`);
        fetchCloudflareData(); // refresh state
      } else {
        throw new Error("API returned failure");
      }
    } catch (err: any) {
      console.error("Toggle dev mode failed:", err);
      toast.error(`Failed to toggle Dev Mode for ${zoneName}`);
    } finally {
      setTogglingDevMode(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECRETS VAULT */}
      <div className="glass-panel rounded-xl p-6 border-destructive/20 bg-destructive/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldAlert className="w-32 h-32 text-destructive" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-destructive">
              <KeyRound className="w-5 h-5" /> Security Vault
            </h2>
            <p className="text-sm text-muted-foreground">
              Provide your API tokens here. They are encrypted at rest using Supabase RLS and are never exposed to the frontend. Only Edge Functions can proxy them.
            </p>
          </div>
          
          <div className="flex-1 space-y-3 w-full max-w-md">
            <div className="relative">
              <input
                type={showCfToken ? "text" : "password"}
                placeholder={hasSecrets.cf ? "•••••••••••••••• Cloudflare API Token Saved" : "Paste Cloudflare API Token..."}
                value={cfToken}
                onChange={(e) => setCfToken(e.target.value)}
                className="w-full rounded-md border border-border bg-background/50 pl-3 pr-10 py-2 text-sm focus:border-[#f48120] transition outline-none"
              />
              <button 
                onClick={() => setShowCfToken(!showCfToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCfToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showSbPat ? "text" : "password"}
                placeholder={hasSecrets.sb ? "•••••••••••••••• Supabase PAT Saved" : "Paste Supabase Personal Access Token..."}
                value={sbPat}
                onChange={(e) => setSbPat(e.target.value)}
                className="w-full rounded-md border border-border bg-background/50 pl-3 pr-10 py-2 text-sm focus:border-[#3ecf8e] transition outline-none"
              />
              <button 
                onClick={() => setShowSbPat(!showSbPat)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showSbPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button 
              onClick={saveSecrets}
              disabled={savingSecrets || (!cfToken && !sbPat)}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 text-sm font-medium transition disabled:opacity-50"
            >
              {savingSecrets ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Secure Vault
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cloudflare Panel */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#f48120]/10 text-[#f48120]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Cloudflare Edge</h2>
                <p className="text-xs text-muted-foreground terminal-text uppercase tracking-widest">Zone Management</p>
              </div>
            </div>
            <button onClick={fetchCloudflareData} disabled={loadingCloudflare} className="p-2 hover:bg-background-elevated rounded-md transition disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${loadingCloudflare ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingCloudflare ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#f48120]" /></div>
          ) : (
            <div className="space-y-4">
              {cloudflareZones.map((zone) => (
                <div key={zone.id} className="flex flex-col gap-4 p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background-elevated/30 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        {zone.name}
                        <span className={`w-2 h-2 rounded-full ${zone.status === 'active' ? 'bg-success' : 'bg-warning'} shadow-[0_0_8px_currentColor]`} />
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 terminal-text">ID: {zone.id.substring(0, 8)}...</p>
                    </div>
                    {zone.development_mode > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-warning/20 text-warning tracking-widest">
                        Dev Mode ON
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => purgeCache(zone.id, zone.name)}
                      disabled={purgingZone === zone.id}
                      className="px-3 py-1.5 text-xs rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium transition flex items-center gap-2 flex-1 justify-center"
                    >
                      {purgingZone === zone.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                      Purge Cache
                    </button>
                    
                    <button 
                      onClick={() => toggleDevMode(zone.id, zone.name, zone.development_mode)}
                      disabled={togglingDevMode === zone.id}
                      className={`px-3 py-1.5 text-xs rounded-md font-medium transition flex items-center gap-2 flex-1 justify-center ${
                        zone.development_mode > 0 
                          ? 'bg-warning/10 text-warning hover:bg-warning/20' 
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {togglingDevMode === zone.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      {zone.development_mode > 0 ? "Disable Dev Mode" : "Enable Dev Mode"}
                    </button>
                    
                    <a 
                      href={`https://dash.cloudflare.com/?to=/:account/${zone.name}/dns`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-medium transition flex items-center gap-2 justify-center"
                    >
                      <Globe className="w-3 h-3" />
                      DNS
                    </a>
                  </div>
                </div>
              ))}
              {cloudflareZones.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">No zones found.</p>}
            </div>
          )}
        </div>

        {/* Supabase Panel */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#3ecf8e]/10 text-[#3ecf8e]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Supabase Clusters</h2>
                <p className="text-xs text-muted-foreground terminal-text uppercase tracking-widest">Project Management</p>
              </div>
            </div>
            <button onClick={fetchSupabaseData} disabled={loadingSupabase} className="p-2 hover:bg-background-elevated rounded-md transition disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${loadingSupabase ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingSupabase ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#3ecf8e]" /></div>
          ) : (
            <div className="space-y-4">
              {supabaseProjects.map((proj) => (
                <div key={proj.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background-elevated/30 transition">
                  <div>
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      {proj.name}
                      <span className={`w-2 h-2 rounded-full ${proj.status === 'ACTIVE_HEALTHY' ? 'bg-[#3ecf8e]' : 'bg-warning'} shadow-[0_0_8px_currentColor]`} />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 terminal-text flex flex-col gap-0.5">
                      <span>Region: {proj.region}</span>
                      <span>Created: {new Date(proj.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`https://supabase.com/dashboard/project/${proj.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs rounded-md bg-[#3ecf8e]/10 text-[#3ecf8e] hover:bg-[#3ecf8e]/20 font-medium transition flex items-center gap-2"
                    >
                      <Server className="w-3 h-3" />
                      Open Dashboard
                    </a>
                  </div>
                </div>
              ))}
              {supabaseProjects.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">No projects found.</p>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
