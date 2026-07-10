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

    const { action, zoneId, payload } = await req.json();

    // 1. Fetch token from secure system_secrets table using Admin's identity
    const { data: secretData } = await supabase
      .from("system_secrets")
      .select("value")
      .eq("key", "CLOUDFLARE_API_TOKEN")
      .single();

    // Fallback to Deno env if not found in table
    const CLOUDFLARE_API_TOKEN = secretData?.value || Deno.env.get("CLOUDFLARE_API_TOKEN");

    if (!CLOUDFLARE_API_TOKEN) {
      // Mock Data Fallback
      return new Response(
        JSON.stringify({
          mock: true,
          zones: [
            { id: "mock_zone_1", name: "omarabouajaja.site", status: "active", development_mode: 0 },
            { id: "mock_zone_2", name: "api.nexusengine.dev", status: "active", development_mode: 3600 }
          ],
          dns: [
            { id: "dns_1", type: "A", name: "omarabouajaja.site", content: "192.0.2.1", proxied: true }
          ]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    };

    if (action === "list_zones") {
      const res = await fetch("https://api.cloudflare.com/client/v4/zones", { headers });
      const data = await res.json();
      return new Response(JSON.stringify({ zones: data.result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "purge_cache" && zoneId) {
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
        method: "POST",
        headers,
        body: JSON.stringify({ purge_everything: true }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: data.success }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "toggle_dev_mode" && zoneId) {
      // payload should be 'on' or 'off'
      const value = payload === "on" ? "on" : "off";
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/settings/development_mode`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: data.success }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_dns" && zoneId) {
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { headers });
      const data = await res.json();
      return new Response(JSON.stringify({ dns: data.result }), {
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
