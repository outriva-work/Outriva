import { NextResponse } from "next/server";

/**
 * Receives messages from the contact form.
 * Set RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example) to have each message emailed,
 * with the visitor's sketch attached. Without them, messages are printed to the server log in
 * development and refused in production, so nothing is silently lost.
 */

const MAX_SKETCH_BYTES = 1_500_000;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The form data couldn't be read." }, { status: 400 });
  }

  if (text(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot

  const name = text(body.name, 120);
  const email = text(body.email, 200);
  const company = text(body.company, 160);
  const timeline = text(body.timeline, 80);
  const message = text(body.message, 6000);
  const services = Array.isArray(body.services) ? body.services.filter((s): s is string => typeof s === "string").slice(0, 8) : [];
  const sketch = typeof body.sketch === "string" && body.sketch.startsWith("data:image/png;base64,") ? body.sketch : null;

  if (!name || !email) return NextResponse.json({ error: "Name and email are required." }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "The email address isn't valid." }, { status: 422 });
  if (!message && !sketch) return NextResponse.json({ error: "Add a message or a sketch." }, { status: 422 });
  if (sketch && sketch.length > MAX_SKETCH_BYTES * 1.37) return NextResponse.json({ error: "The sketch is too large." }, { status: 413 });

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    services.length ? `Interested in: ${services.join(", ")}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    sketch ? "Sketch: attached" : null,
    "",
    message || "(No message, see the sketch.)",
  ].filter((l): l is string => l !== null);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[Contact form — email not configured]\n${lines.join("\n")}\n`);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "The contact form isn't connected yet." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Outriva website <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `New project enquiry from ${name}${company ? `, ${company}` : ""}`,
      text: lines.join("\n"),
      attachments: sketch ? [{ filename: "sketch.png", content: sketch.split(",")[1] }] : undefined,
    }),
  });

  if (!res.ok) {
    console.error("Contact email failed", res.status, await res.text());
    return NextResponse.json({ error: "The message couldn't be delivered." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
