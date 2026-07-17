-- ============================================
-- Rename Women's Retreat to No Reins
-- ============================================

-- Rename the registrations table
ALTER TABLE IF EXISTS womens_retreat_registrations RENAME TO no_reins_registrations;

-- Update the program slug in the programs table
UPDATE programs SET slug = 'no-reins', name = 'No Reins' WHERE slug = 'womens-retreat';

-- Rename indexes if they exist (these will fail silently if they don't exist)
DO $$
BEGIN
  -- Try to rename indexes
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_womens_retreat_registrations_reminder') THEN
    ALTER INDEX idx_womens_retreat_registrations_reminder RENAME TO idx_no_reins_registrations_reminder;
  END IF;
END $$;

-- Update any RLS policies to reflect new table name
-- Drop old policies and create new ones for the renamed table
DO $$
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Service role has full access to womens retreat registrations" ON no_reins_registrations;
  DROP POLICY IF EXISTS "Users can view their own womens retreat registrations" ON no_reins_registrations;

  -- Create new policies with correct naming
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to no reins registrations' AND tablename = 'no_reins_registrations') THEN
    CREATE POLICY "Service role has full access to no reins registrations" ON no_reins_registrations
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
