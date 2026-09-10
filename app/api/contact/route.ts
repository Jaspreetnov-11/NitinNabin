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

  const sb = getServerClient();
  if (!sb) return NextResponse.json({ ok: false, error: "Backend not configured" }, { status: 503 });

  const { error } = await sb.from("contact_messages").insert({
    name,
    contact,
    message,
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  });

  if (error) {
    console.error("[contact] insert failed:", error);
    return NextResponse.json({ ok: false, error: "Could not save message" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
