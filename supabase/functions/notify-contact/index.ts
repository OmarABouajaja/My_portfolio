/**
 * Edge Function: notify-contact
 * Fires when a visitor submits the contact form → emails admin via Resend.
 */

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "omar.abouajaja@gmail.com";
const FROM = "Abouajaja_Omar/ <notifications@nexusengine.dev>";
const SITE = Deno.env.get("SITE_URL") || "https://omarabouajaja.dev";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) return json({ error: "Missing fields" }, 400);
    if (!RESEND_KEY) return json({ skipped: true, reason: "No API key" });

    const safeName = esc(name);
    const safeEmail = esc(email);
    const safeMsg = esc(message);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: FROM,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `📩 New contact from ${name} — Abouajaja_Omar/`,
        html: `
          <div style="font-family:'Inter',system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0a0a0f;color:#e4e4e7;border-radius:16px;border:1px solid #27272a">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
              <div style="width:32px;height:32px;background:linear-gradient(135deg,#22d3ee,#6366f1);border-radius:8px;display:flex;align-items:center;justify-content:center">
                <span style="font-size:16px">⚡</span>
              </div>
              <span style="font-weight:600;font-size:14px;letter-spacing:.05em;text-transform:uppercase;color:#a1a1aa">Abouajaja_Omar/ Contact</span>
            </div>
            <p style="color:#a1a1aa;font-size:13px;margin-bottom:4px">New message from:</p>
            <p style="font-size:16px;font-weight:600;margin:0;color:#22d3ee">${safeName}</p>
            <p style="font-size:13px;color:#a1a1aa;margin:4px 0 16px">${safeEmail}</p>
            <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:16px;margin:16px 0">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#e4e4e7;white-space:pre-wrap">${safeMsg}</p>
            </div>
            <a href="mailto:${safeEmail}?subject=Re: Your message on Abouajaja_Omar/" style="display:inline-block;margin-top:16px;padding:10px 20px;background:linear-gradient(135deg,#22d3ee,#6366f1);color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px">Reply to ${safeName} →</a>
            <a href="${SITE}/admin" style="display:inline-block;margin-top:8px;margin-left:8px;padding:10px 20px;background:#27272a;color:#e4e4e7;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px">Open Admin →</a>
            <p style="margin-top:24px;font-size:11px;color:#52525b">Automated notification from Abouajaja_Omar/.</p>
          </div>`,
      }),
    });

    const result = await res.json();
    return json({ success: true, emailId: result.id });
  } catch (error: any) {
    console.error("notify-contact:", error);
    return json({ error: error.message }, 500);
  }
});
