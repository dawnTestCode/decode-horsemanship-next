// lib/syncAppointment.ts
// Shared logic for writing one Acuity appointment into Supabase.
// Used by both the full sync (cron) route and the webhook route so the two
// stay in lockstep.

import { supabaseAdmin } from "./supabaseAdmin";
import { AcuityAppointment, AcuityAppointmentType, AcuityCalendar } from "./acuity";

export async function upsertAppointmentType(t: AcuityAppointmentType) {
  const db = supabaseAdmin();
  await db.from("acuity_appointment_types").upsert({
    id: t.id,
    name: t.name,
    description: t.description ?? null,
    category: t.category ?? null,
    duration_minutes: t.duration ? parseInt(t.duration, 10) : null,
    price: t.price ? parseFloat(t.price) : null,
    is_class: t.type === "class",
    active: t.active,
    color: t.color ?? null,
    raw: t,
    synced_at: new Date().toISOString(),
  });
}

export async function upsertCalendar(c: AcuityCalendar) {
  const db = supabaseAdmin();
  await db.from("acuity_calendars").upsert({
    id: c.id,
    name: c.name,
    email: c.email ?? null,
    synced_at: new Date().toISOString(),
  });
}

/**
 * Upsert a single appointment: ensures its class session exists (creating it
 * on first sight), then upserts the attendee row against that session.
 */
export async function upsertAppointment(appt: AcuityAppointment) {
  const db = supabaseAdmin();

  // Find or create the class session this appointment belongs to.
  // Sessions are keyed on (appointment type, start time, calendar) so that
  // every attendee booked into the same class/date lands on the same row.
  const { data: existingSession } = await db
    .from("acuity_class_sessions")
    .select("id")
    .eq("appointment_type_id", appt.appointmentTypeID)
    .eq("starts_at", appt.datetime)
    .eq("calendar_id", appt.calendarID)
    .maybeSingle();

  let sessionId = existingSession?.id as number | undefined;

  if (!sessionId) {
    const { data: inserted, error } = await db
      .from("acuity_class_sessions")
      .insert({
        appointment_type_id: appt.appointmentTypeID,
        calendar_id: appt.calendarID,
        acuity_class_id: appt.classID,
        starts_at: appt.datetime,
        ends_at: appt.endTime ?? null,
        location: appt.location ?? null,
        raw: appt,
      })
      .select("id")
      .single();
    if (error) throw error;
    sessionId = inserted.id;
  } else {
    // Keep session-level fields fresh (location changes, etc.)
    await db
      .from("acuity_class_sessions")
      .update({
        location: appt.location ?? null,
        acuity_class_id: appt.classID,
        synced_at: new Date().toISOString(),
      })
      .eq("id", sessionId);
  }

  await db.from("acuity_attendees").upsert({
    id: appt.id,
    class_session_id: sessionId,
    appointment_type_id: appt.appointmentTypeID,
    first_name: appt.firstName,
    last_name: appt.lastName,
    email: appt.email,
    phone: appt.phone ?? null,
    notes: appt.notes ?? null,
    canceled: appt.canceled,
    no_show: appt.noShow,
    amount_paid: appt.amountPaid ? parseFloat(appt.amountPaid) : null,
    forms: appt.forms ?? null,
    raw: appt,
    created_at: appt.dateCreated ?? null,
    synced_at: new Date().toISOString(),
  });

  return sessionId;
}
