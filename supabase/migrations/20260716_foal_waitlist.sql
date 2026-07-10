-- Foal Handling Lessons Waitlist
-- Stores signups for foal-handling lessons tied to upcoming Gypsy Vanner foal

CREATE TABLE IF NOT EXISTS foal_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  heard_about TEXT,
  interest_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed BOOLEAN DEFAULT false
);

-- Index for querying active subscribers
CREATE INDEX IF NOT EXISTS idx_foal_waitlist_active ON foal_waitlist(unsubscribed) WHERE unsubscribed = false;
CREATE INDEX IF NOT EXISTS idx_foal_waitlist_email ON foal_waitlist(email);

-- Enable RLS
ALTER TABLE foal_waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert foal waitlist' AND tablename = 'foal_waitlist') THEN
    CREATE POLICY "Anyone can insert foal waitlist" ON foal_waitlist
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to foal waitlist' AND tablename = 'foal_waitlist') THEN
    CREATE POLICY "Service role has full access to foal waitlist" ON foal_waitlist
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
