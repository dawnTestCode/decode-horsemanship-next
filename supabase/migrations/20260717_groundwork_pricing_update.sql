-- Update Groundwork pricing: $850 -> $475 (half-day program)
-- No deposit - full payment at booking

UPDATE programs
SET
  full_price = 47500,
  deposit_amount = NULL,
  deposit_only = false,
  price_label = '$475',
  description = 'A half-day with horses for men'
WHERE slug = 'groundwork';

-- Update session times: full day (8:30-16:00) -> half-day (8:30-12:30)
UPDATE groundwork_sessions
SET
  end_time = '12:30',
  updated_at = now()
WHERE end_time = '16:00';
