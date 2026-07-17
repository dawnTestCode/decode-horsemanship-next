-- Fix RLS policies for copper_and_lace_sessions to allow admin operations
-- Currently only service_role can insert/update/delete

-- Allow anyone to insert sessions (for admin calendar)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert copper and lace sessions' AND tablename = 'copper_and_lace_sessions') THEN
    CREATE POLICY "Anyone can insert copper and lace sessions" ON copper_and_lace_sessions
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Allow anyone to update sessions (for admin calendar)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update copper and lace sessions' AND tablename = 'copper_and_lace_sessions') THEN
    CREATE POLICY "Anyone can update copper and lace sessions" ON copper_and_lace_sessions
      FOR UPDATE USING (true);
  END IF;
END $$;

-- Allow anyone to delete sessions (for admin calendar)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can delete copper and lace sessions' AND tablename = 'copper_and_lace_sessions') THEN
    CREATE POLICY "Anyone can delete copper and lace sessions" ON copper_and_lace_sessions
      FOR DELETE USING (true);
  END IF;
END $$;

-- Also need to allow viewing all sessions (not just open ones) for admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view all copper and lace sessions' AND tablename = 'copper_and_lace_sessions') THEN
    CREATE POLICY "Anyone can view all copper and lace sessions" ON copper_and_lace_sessions
      FOR SELECT USING (true);
  END IF;
END $$;
