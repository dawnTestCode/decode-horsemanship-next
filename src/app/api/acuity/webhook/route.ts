// app/api/acuity/webhook/route.ts
// Receives Acuity's webhook POSTs (appointment.scheduled / .rescheduled /
// .canceled / .changed) and re-syncs just that one appointment.
//
// Set this URL in Acuity under Integrations > Webhooks:
//   https://<your-domain>/api/acuity/webhook
//
// Acuity signs requests with your API key (HMAC-SHA256 of the raw body,
// base64-encoded, in the X-Acuity-Signature header). Verify it below so
// nothing but Acuity can trigger a sync.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAppointment } from "@/lib/acuity";
import { upsertAppointment } from "@/lib/syncAppointment";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function isValidSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const apiKey = process.env.ACUITY_API_KEY;
  if (!apiKey) return false;
  const expected = crypto.createHmac("sha256", apiKey).update(rawBody).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-acuity-signature");

  if (!isValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Body is application/x-www-form-urlencoded: action, id, calendarID, appointmentTypeID
  const params = new URLSearchParams(rawBody);
  const appointmentId = params.get("id");

  const db = supabaseAdmin();

  if (!appointmentId) {
    await db.from("acuity_sync_log").insert({
      trigger: "webhook",
      appointments_seen: 0,
      appointments_upserted: 0,
      error: "Webhook payload missing appointment id",
    });
    return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });
  }

  try {
    const appt = await getAppointment(appointmentId);
    await upsertAppointment(appt);
    await db.from("acuity_sync_log").insert({
      trigger: "webhook",
      appointments_seen: 1,
      appointments_upserted: 1,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await db.from("acuity_sync_log").insert({
      trigger: "webhook",
      appointments_seen: 1,
      appointments_upserted: 0,
      error: errorMessage,
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
