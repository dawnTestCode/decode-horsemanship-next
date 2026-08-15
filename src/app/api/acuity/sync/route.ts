// app/api/acuity/sync/route.ts
// Full sync: pulls appointment types, calendars, and appointments from Acuity
// and upserts them into Supabase. Intended to run on a schedule (Vercel Cron)
// as a backstop to the webhook, and to backfill history on first setup.
//
// Protect this route with a shared secret so it can't be triggered publicly —
// see the CRON_SECRET check below. Add to vercel.json:
//   { "crons": [{ "path": "/api/acuity/sync", "schedule": "0 */6 * * *" }] }

import { NextRequest, NextResponse } from "next/server";
import { getAppointmentTypes, getCalendars, getAppointments } from "@/lib/acuity";
import { upsertAppointmentType, upsertCalendar, upsertAppointment } from "@/lib/syncAppointment";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();
  let seen = 0;
  let upserted = 0;
  let errorMessage: string | null = null;

  try {
    const [types, calendars] = await Promise.all([getAppointmentTypes(), getCalendars()]);
    for (const t of types) await upsertAppointmentType(t);
    for (const c of calendars) await upsertCalendar(c);

    // Sync a rolling window: 30 days back (to catch recent cancellations/no-shows)
    // through 180 days ahead (to catch future bookings). Adjust to taste.
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 30);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 180);

    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    // Acuity returns up to `max` results per call with no offset param on v1;
    // for high-volume calendars, narrow minDate/maxDate windows (e.g. month by
    // month) instead of one wide pull.
    const appointments = await getAppointments({
      minDate: fmt(minDate),
      maxDate: fmt(maxDate),
      includeCanceled: true,
      max: 100,
    });

    seen = appointments.length;
    for (const appt of appointments) {
      await upsertAppointment(appt);
      upserted++;
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  await db.from("acuity_sync_log").insert({
    trigger: "cron",
    appointments_seen: seen,
    appointments_upserted: upserted,
    error: errorMessage,
  });

  if (errorMessage) {
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
  return NextResponse.json({ ok: true, seen, upserted });
}
