import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  material?: string;
  removal?: string;
  message?: string;
  company?: string; // honeypot
};

function esc(s = "") {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
}

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept bots without sending.
  if (data.company) return NextResponse.json({ ok: true });

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please provide your name and a valid email." }, { status: 422 });
  }

  const to = process.env.CONTACT_TO || "info@jupitergranite.com";
  const from = process.env.CONTACT_FROM || "Jupiter Granite Website <onboarding@resend.dev>";
  const key = process.env.RESEND_API_KEY;

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", data.phone || "—"],
    ["Project location", data.location || "—"],
    ["Material", data.material || "—"],
    ["Remove existing surfaces?", data.removal || "—"],
  ];
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#15130f">
      <h2 style="font-weight:600">New estimate request — jupitergranite.com</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#8c8479;width:40%">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join("")}
      </table>
      <p style="color:#8c8479;margin:0 0 4px">Project details</p>
      <p style="white-space:pre-wrap;line-height:1.5">${esc(data.message || "—")}</p>
    </div>`;

  // If no provider key is configured yet, tell the client to use the mailto fallback.
  if (!key) {
    return NextResponse.json(
      { ok: false, unconfigured: true, error: "Email delivery isn't configured yet." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Estimate request — ${name}`,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error", res.status, detail);
      return NextResponse.json({ ok: false, error: "We couldn't send that just now." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "We couldn't send that just now." }, { status: 502 });
  }
}
