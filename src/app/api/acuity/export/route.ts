// app/api/acuity/export/route.ts
// Downloads the attendee list for one class session as a CSV, for whenever
// you need a list outside the admin UI (e.g. to paste into another tool).

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function toCsvValue(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("acuity_attendees")
    .select("first_name,last_name,email,phone,notes,canceled,no_show,created_at")
    .eq("class_session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = ["First Name", "Last Name", "Email", "Phone", "Notes", "Canceled", "No-show", "Registered At"];
  const rows = (data ?? []).map((a) =>
    [a.first_name, a.last_name, a.email, a.phone, a.notes, a.canceled, a.no_show, a.created_at]
      .map(toCsvValue)
      .join(",")
  );
  const csv = [header.map(toCsvValue).join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="class-${sessionId}-attendees.csv"`,
    },
  });
}
