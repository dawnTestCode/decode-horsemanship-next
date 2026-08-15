// lib/acuity.ts
// Thin wrapper around the Acuity Scheduling REST API.
// Requires ACUITY_USER_ID and ACUITY_API_KEY (Basic Auth) in your environment.
// Full API access requires Acuity's Premium/Powerhouse plan — confirm your plan
// before wiring this up.

const ACUITY_BASE = "https://acuityscheduling.com/api/v1";

function authHeader() {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;
  if (!userId || !apiKey) {
    throw new Error("Missing ACUITY_USER_ID or ACUITY_API_KEY env vars");
  }
  const token = Buffer.from(`${userId}:${apiKey}`).toString("base64");
  return `Basic ${token}`;
}

async function acuityFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${ACUITY_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: authHeader() },
    // Acuity data changes frequently; don't let Next.js cache this.
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Acuity API ${path} failed: ${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface AcuityAppointmentType {
  id: number;
  name: string;
  description?: string;
  category?: string;
  duration: string; // minutes, as a string
  price: string;
  type: "service" | "class" | "package";
  active: boolean;
  color?: string;
}

export interface AcuityCalendar {
  id: number;
  name: string;
  email?: string;
}

export interface AcuityAppointment {
  id: number;
  appointmentTypeID: number;
  classID: number | null; // present for group class attendees, shared across the same session
  calendarID: number;
  datetime: string; // ISO string
  endTime?: string;
  duration: string;
  price: string;
  amountPaid: string;
  location?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
  canceled: boolean;
  noShow: boolean;
  forms?: unknown;
  scheduledBy?: string;
  dateCreated?: string;
}

export function getAppointmentTypes() {
  return acuityFetch<AcuityAppointmentType[]>("/appointment-types");
}

export function getCalendars() {
  return acuityFetch<AcuityCalendar[]>("/calendars");
}

/**
 * Pull appointments in a date range (defaults to a wide rolling window if omitted).
 * Acuity paginates via `max` (up to 100 per request); for a full backfill, page with
 * `minDate`/`maxDate` windows narrow enough to stay under that if you have high volume.
 */
export function getAppointments(opts: {
  minDate?: string; // YYYY-MM-DD
  maxDate?: string;
  includeCanceled?: boolean;
  max?: number;
} = {}) {
  const params: Record<string, string> = {
    max: String(opts.max ?? 100),
  };
  if (opts.minDate) params.minDate = opts.minDate;
  if (opts.maxDate) params.maxDate = opts.maxDate;
  if (opts.includeCanceled) params.canceled = "true";
  return acuityFetch<AcuityAppointment[]>("/appointments", params);
}

export function getAppointment(id: number | string) {
  return acuityFetch<AcuityAppointment>(`/appointments/${id}`);
}
