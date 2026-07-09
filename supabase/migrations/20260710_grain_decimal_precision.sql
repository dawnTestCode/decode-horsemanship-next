-- Increase decimal precision for grain_horses feeding amounts
-- Allow 2 decimal places instead of 1 (e.g., 1.25 instead of just 1.2)

ALTER TABLE grain_horses
  ALTER COLUMN cans_per_feeding TYPE DECIMAL(4,2),
  ALTER COLUMN vitamin_scoops TYPE DECIMAL(4,2);
