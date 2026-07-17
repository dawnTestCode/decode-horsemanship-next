-- ============================================
-- Copper & Lace Database Setup
-- ============================================

-- Copper & Lace Sessions table (available dates)
CREATE TABLE IF NOT EXISTS copper_and_lace_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 6 CHECK (capacity >= 2 AND capacity <= 6),
  enrolled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_copper_lace_sessions_date ON copper_and_lace_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_copper_lace_sessions_status ON copper_and_lace_sessions(status);

-- Enable RLS for sessions
ALTER TABLE copper_and_lace_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to sessions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to copper and lace sessions' AND tablename = 'copper_and_lace_sessions') THEN
    CREATE POLICY "Service role has full access to copper and lace sessions" ON copper_and_lace_sessions
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- Allow anonymous read access to open sessions (for registration page)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view open copper and lace sessions' AND tablename = 'copper_and_lace_sessions') THEN
    CREATE POLICY "Anyone can view open copper and lace sessions" ON copper_and_lace_sessions
      FOR SELECT USING (status = 'open');
  END IF;
END $$;


-- Copper & Lace Packages table (pricing)
CREATE TABLE IF NOT EXISTS copper_lace_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,  -- in cents, per person
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default packages
INSERT INTO copper_lace_packages (slug, name, description, price, sort_order)
VALUES
  ('day-pass', 'Day Pass', 'Sunup to four-thirty', 72500, 1),
  ('stay-till-moonrise', 'Stay Till Moonrise', 'Until the last story''s told', 89500, 2)
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Enable RLS
ALTER TABLE copper_lace_packages ENABLE ROW LEVEL SECURITY;

-- Public read for active packages
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active copper lace packages' AND tablename = 'copper_lace_packages') THEN
    CREATE POLICY "Public can read active copper lace packages" ON copper_lace_packages
      FOR SELECT USING (active = true);
  END IF;
END $$;

-- Service role full access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to copper lace packages' AND tablename = 'copper_lace_packages') THEN
    CREATE POLICY "Service role has full access to copper lace packages" ON copper_lace_packages
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;


-- Copper & Lace Bookings table (registrations)
CREATE TABLE IF NOT EXISTS copper_and_lace_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES copper_and_lace_sessions(id) ON DELETE SET NULL,
  booked_date DATE NOT NULL,
  confirmation_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 6),
  package_type TEXT NOT NULL CHECK (package_type IN ('day-pass', 'stay-till-moonrise')),
  message TEXT,
  amount_paid INTEGER NOT NULL,  -- in cents
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'cancelled', 'refunded', 'completed')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_copper_lace_bookings_email ON copper_and_lace_bookings(email);
CREATE INDEX IF NOT EXISTS idx_copper_lace_bookings_confirmation ON copper_and_lace_bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_copper_lace_bookings_status ON copper_and_lace_bookings(status);
CREATE INDEX IF NOT EXISTS idx_copper_lace_bookings_session ON copper_and_lace_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_copper_lace_bookings_date ON copper_and_lace_bookings(booked_date);

-- Enable RLS for bookings
ALTER TABLE copper_and_lace_bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to bookings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to copper and lace bookings' AND tablename = 'copper_and_lace_bookings') THEN
    CREATE POLICY "Service role has full access to copper and lace bookings" ON copper_and_lace_bookings
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;


-- Function to increment enrolled count and auto-update status
CREATE OR REPLACE FUNCTION increment_copper_lace_enrolled(
  p_session_id UUID,
  p_party_size INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_capacity INTEGER;
  v_new_enrolled INTEGER;
BEGIN
  -- Get capacity and compute new enrolled count
  SELECT capacity, enrolled + p_party_size INTO v_capacity, v_new_enrolled
  FROM copper_and_lace_sessions
  WHERE id = p_session_id;

  -- Update enrolled count
  UPDATE copper_and_lace_sessions
  SET
    enrolled = v_new_enrolled,
    status = CASE WHEN v_new_enrolled >= v_capacity THEN 'full' ELSE status END,
    updated_at = now()
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Add Copper & Lace to programs table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'programs') THEN
    INSERT INTO programs (slug, name, audience, description, deposit_only, deposit_amount, full_price, price_label, active, booking_type)
    VALUES ('copper-and-lace', 'Copper & Lace', 'womens', 'A woman''s day at Decode Horsemanship', false, NULL, 72500, 'From $725', true, 'preset')
    ON CONFLICT (slug) DO UPDATE SET
      deposit_only = EXCLUDED.deposit_only,
      deposit_amount = EXCLUDED.deposit_amount,
      full_price = EXCLUDED.full_price,
      price_label = EXCLUDED.price_label;
  END IF;
END $$;
