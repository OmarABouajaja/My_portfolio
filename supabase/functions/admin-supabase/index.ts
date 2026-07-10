// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { action, ref } = await req.json();

    // 1. Fetch token from secure system_secrets table using Admin's identity
    const { data: secretData } = await supabase
      .from("system_secrets")
      .select("value")
      .eq("key", "SUPABASE_PAT")
      .single();

    // Fallback to Deno env if not found in table
    const SUPABASE_PAT = secretData?.value || Deno.env.get("SUPABASE_PAT");

    if (!SUPABASE_PAT) {
      // Mock Data Fallback
      return new Response(
        JSON.stringify({
          mock: true,
          projects: [
            { id: "mock_proj_1", name: "abouajaja-portfolio", status: "ACTIVE_HEALTHY", region: "eu-west-1", created_at: new Date().toISOString() },
            { id: "mock_proj_2", name: "nexus-engine", status: "ACTIVE_HEALTHY", region: "us-east-1", created_at: new Date().toISOString() }
          ],
          metrics: [
            { cpu_usage: 12.5, memory_usage: 45.2, active_connections: 12 }
          ]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = {
      Authorization: `Bearer ${SUPABASE_PAT}`,
      "Content-Type": "application/json",
    };

    if (action === "list_projects") {
      const res = await fetch("https://api.supabase.com/v1/projects", { headers });
      const data = await res.json();
      return new Response(JSON.stringify({ projects: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Attempt to get project metrics (Requires specific tier, but we can try)
    if (action === "get_metrics" && ref) {
      // Management API endpoint for project network metrics (example)
      const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/network-restrictions`, { headers });
      const data = await res.json();
      // To get real performance metrics, typically Grafana or specific enterprise endpoints are needed, 
      // but we return what we can from management API or mock it for standard tiers.
      return new Response(JSON.stringify({ metrics: { network_restrictions: data } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
