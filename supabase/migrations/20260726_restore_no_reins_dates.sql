-- Restore No Reins program dates that were accidentally deleted
-- Based on screenshot showing dates from May 30, 2026 through Nov 14, 2026

INSERT INTO program_dates (program_id, start_date, start_time, end_time, capacity, enrolled, status)
SELECT
  p.id,
  dates.start_date,
  '10:00:00'::time,
  '14:00:00'::time,
  8,
  dates.enrolled,
  'open'
FROM programs p
CROSS JOIN (VALUES
  ('2026-05-30'::date, 1),  -- 1/8 enrolled
  ('2026-06-20'::date, 1),  -- 1/8 enrolled
  ('2026-08-15'::date, 0),
  ('2026-09-19'::date, 0),
  ('2026-10-17'::date, 0),
  ('2026-11-14'::date, 0)
) AS dates(start_date, enrolled)
WHERE p.slug = 'no-reins';
