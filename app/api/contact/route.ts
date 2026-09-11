import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

type Body = { name?: unknown; contact?: unknown; message?: unknown; website?: unknown };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (str(body.website, 10)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const contact = str(body.contact, 160);
  const message = str(body.message, 2000);

  if (name.length < 2 || contact.length < 3 || message.length < 5) {
    return NextResponse.json({ ok: false, error: "Please fill all fields" }, { status: 422 });
  }

  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);

  // Persist to Supabase if configured
  try {
    const sb = getServerClient();
    if (sb) {
      await sb.from("contact_messages").insert({
        name,
        contact,
        message,
        user_agent: userAgent,
      });
    }
  } catch (dbErr) {
    console.error("[contact] Supabase save error:", dbErr);
  }

  return NextResponse.json({ ok: true });
}
