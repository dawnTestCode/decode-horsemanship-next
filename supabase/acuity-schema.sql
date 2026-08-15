-- Acuity Scheduling sync schema
-- Run this in the Supabase SQL editor (or via `supabase db push` / a migration file).
--
-- Model:
--   acuity_appointment_types  -> the "class" definitions in Acuity (e.g. "Groundwork 101")
--   acuity_class_sessions     -> one specific date/time occurrence of a class (a group of attendees)
--   acuity_attendees          -> individual bookings/registrations tied to a session
--   acuity_calendars          -> Acuity calendars (staff/instructor calendars), for reference
--   acuity_sync_log           -> history of sync runs, for debugging

create table if not exists acuity_calendars (
  id bigint primary key,              -- Acuity calendarID
  name text not null,
  email text,
  synced_at timestamptz not null default now()
);

create table if not exists acuity_appointment_types (
  id bigint primary key,              -- Acuity appointmentTypeID
  name text not null,
  description text,
  category text,
  duration_minutes int,
  price numeric(10,2),
  is_class boolean not null default false,   -- true for group classes vs 1:1 appointments
  active boolean not null default true,
  color text,
  raw jsonb,                          -- full Acuity payload, for anything not modeled above
  synced_at timestamptz not null default now()
);

create table if not exists acuity_class_sessions (
  id bigint generated always as identity primary key,
  appointment_type_id bigint not null references acuity_appointment_types(id) on delete cascade,
  calendar_id bigint references acuity_calendars(id),
  acuity_class_id bigint,             -- Acuity's classID grouping attendees at this date/time (nullable for 1:1 types)
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  capacity int,
  registered_count int not null default 0,   -- denormalized, kept in sync by trigger below
  canceled boolean not null default false,
  raw jsonb,
  synced_at timestamptz not null default now(),
  unique (appointment_type_id, starts_at, calendar_id)
);

create index if not exists idx_class_sessions_starts_at on acuity_class_sessions (starts_at);
create index if not exists idx_class_sessions_appt_type on acuity_class_sessions (appointment_type_id);

create table if not exists acuity_attendees (
  id bigint primary key,              -- Acuity appointmentID (unique per attendee per session)
  class_session_id bigint references acuity_class_sessions(id) on delete cascade,
  appointment_type_id bigint references acuity_appointment_types(id),
  first_name text,
  last_name text,
  email text,
  phone text,
  notes text,
  canceled boolean not null default false,
  no_show boolean not null default false,
  amount_paid numeric(10,2),
  forms jsonb,                        -- intake form answers, as Acuity returns them
  raw jsonb,
  created_at timestamptz,             -- when the booking was made (from Acuity)
  synced_at timestamptz not null default now()
);

create index if not exists idx_attendees_session on acuity_attendees (class_session_id);
create index if not exists idx_attendees_email on acuity_attendees (email);

create table if not exists acuity_sync_log (
  id bigint generated always as identity primary key,
  run_at timestamptz not null default now(),
  trigger text not null,              -- 'cron', 'webhook', 'manual'
  appointments_seen int default 0,
  appointments_upserted int default 0,
  error text
);

-- Keep registered_count on acuity_class_sessions accurate whenever attendees change.
create or replace function acuity_refresh_session_count() returns trigger as $$
begin
  update acuity_class_sessions s
  set registered_count = (
    select count(*) from acuity_attendees a
    where a.class_session_id = s.id and not a.canceled
  )
  where s.id = coalesce(new.class_session_id, old.class_session_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_acuity_attendees_count on acuity_attendees;
create trigger trg_acuity_attendees_count
after insert or update or delete on acuity_attendees
for each row execute function acuity_refresh_session_count();

-- Convenience view for the admin UI: one row per session with class name + counts.
create or replace view acuity_class_sessions_view as
select
  s.id,
  s.starts_at,
  s.ends_at,
  s.location,
  s.capacity,
  s.registered_count,
  s.canceled,
  t.id as appointment_type_id,
  t.name as class_name,
  t.category,
  c.id as calendar_id,
  c.name as calendar_name
from acuity_class_sessions s
join acuity_appointment_types t on t.id = s.appointment_type_id
left join acuity_calendars c on c.id = s.calendar_id;

-- Row Level Security: lock these tables to admin/service-role access only.
-- The admin panel uses the service role key, so these won't block it.
alter table acuity_calendars enable row level security;
alter table acuity_appointment_types enable row level security;
alter table acuity_class_sessions enable row level security;
alter table acuity_attendees enable row level security;
alter table acuity_sync_log enable row level security;

-- Allow service role (used by admin panel) to access all data
-- No additional policies needed since service role bypasses RLS
