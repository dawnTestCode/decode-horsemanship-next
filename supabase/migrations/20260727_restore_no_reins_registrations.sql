-- Restore the 2 No Reins registrations that were accidentally deleted

-- First, get the program_date IDs for the specific dates
-- Registration 1: Emma Anderson - May 30, 2026
-- Registration 2: Sarah Fotheringham - June 20, 2026

-- Insert Emma Anderson's registration (May 30, 2026)
INSERT INTO no_reins_registrations (
  confirmation_code,
  program_date_id,
  session_date,
  first_name,
  last_name,
  email,
  phone,
  age_range,
  horse_experience,
  referral_source,
  amount_paid,
  status,
  anything_to_know,
  digital_signature
)
SELECT
  'WR-ARZPLV',
  pd.id,
  '2026-05-30',
  'Emma',
  'Anderson',
  'emmaj.anderson@outlook.com',
  '7244564435',
  '50-59',
  'a-little',
  'facebook',
  225,
  'confirmed',
  'Can''t eat meat but otherwise not picky 😊 carry an epi-pen',
  'Emma Anderson'
FROM program_dates pd
JOIN programs p ON pd.program_id = p.id
WHERE p.slug = 'no-reins' AND pd.start_date = '2026-05-30';

-- Insert Sarah Fotheringham's registration (June 20, 2026)
INSERT INTO no_reins_registrations (
  confirmation_code,
  program_date_id,
  session_date,
  first_name,
  last_name,
  email,
  phone,
  age_range,
  horse_experience,
  referral_source,
  amount_paid,
  status,
  digital_signature
)
SELECT
  'WR-5ESBN9',
  pd.id,
  '2026-06-20',
  'Sarah',
  'Fotheringham',
  'smf6706@gmail.com',
  '9195596706',
  '40-49',
  'a-little',
  'other',
  375,
  'confirmed',
  'Sarah Fotheringham'
FROM program_dates pd
JOIN programs p ON pd.program_id = p.id
WHERE p.slug = 'no-reins' AND pd.start_date = '2026-06-20';

-- Update enrolled counts on the program_dates
UPDATE program_dates SET enrolled = 1
WHERE id IN (
  SELECT pd.id FROM program_dates pd
  JOIN programs p ON pd.program_id = p.id
  WHERE p.slug = 'no-reins' AND pd.start_date IN ('2026-05-30', '2026-06-20')
);
