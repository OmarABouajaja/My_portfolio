// @ts-nocheck
/**
 * Edge Function: notify-chat
 * Webhook on chat_messages INSERT → emails the opposite party via Resend.
 */

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "omar.abouajaja@gmail.com";
const FROM = "Abouajaja_Omar/ <notifications@nexusengine.dev>";
const SITE = Deno.env.get("SITE_URL") || "https://omarabouajaja.site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CORS = {
  "Access-Control-Allow-Origin": "https://omarabouajaja.site",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...CORS } });

interface Payload {
  type: "INSERT";
  table: "chat_messages";
  record: {
    id: string;
    client_token_id: string;
    sender: "client" | "omar";
    text: string;
    read: boolean;
    created_at: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { record }: Payload = await req.json();
    if (!record?.text) return json({ error: "Invalid payload" }, 400);
    if (!RESEND_KEY) return json({ skipped: true, reason: "No API key" });

    let toEmail: string;
    let subject: string;

    if (record.sender === "client") {
      toEmail = ADMIN_EMAIL;
      subject = "💬 New client message in Abouajaja_Omar/";
    } else {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      const { data: row } = await sb
        .from("client_tokens").select("client_email")
        .eq("id", record.client_token_id).single();

      if (!row?.client_email) return json({ skipped: true, reason: "No client email" });
      toEmail = row.client_email;
      subject = "📩 Omar sent you a message — Abouajaja_Omar/";
    }

    const safeText = esc(record.text);
    const senderLabel = record.sender === "client" ? "Your client" : "Omar";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: FROM,
        to: [toEmail],
        subject,
        html: `
          <div style="font-family:'Inter',system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0f;color:#e4e4e7;border-radius:16px;border:1px solid #27272a">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
              <div style="width:32px;height:32px;background:linear-gradient(135deg,#22d3ee,#6366f1);border-radius:8px;display:flex;align-items:center;justify-content:center">
                <span style="font-size:16px">⚡</span>
              </div>
              <span style="font-weight:600;font-size:14px;letter-spacing:.05em;text-transform:uppercase;color:#a1a1aa">Abouajaja_Omar/</span>
            </div>
            <p style="color:#a1a1aa;font-size:13px;margin-bottom:8px">${senderLabel} sent a new message:</p>
            <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:16px;margin:16px 0">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#e4e4e7">${safeText}</p>
            </div>
            <a href="${SITE}/client" style="display:inline-block;margin-top:16px;padding:10px 20px;background:linear-gradient(135deg,#22d3ee,#6366f1);color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px">Open Portal →</a>
            <p style="margin-top:24px;font-size:11px;color:#52525b">Automated notification from Abouajaja_Omar/.</p>
          </div>`,
      }),
    });

    const result = await res.json();
    return json({ success: true, emailId: result.id });
  } catch (error: any) {
    console.error("notify-chat:", error);
    return json({ error: error.message }, 500);
  }
});
