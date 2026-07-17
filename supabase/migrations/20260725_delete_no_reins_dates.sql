-- Delete all No Reins registrations and program dates
-- First delete registrations (child records), then dates

DELETE FROM no_reins_registrations
WHERE program_date_id IN (
  SELECT pd.id FROM program_dates pd
  JOIN programs p ON pd.program_id = p.id
  WHERE p.slug = 'no-reins'
);

DELETE FROM program_dates
WHERE program_id IN (
  SELECT id FROM programs WHERE slug = 'no-reins'
);
