-- Dust & Leather Sessions table (available dates)
CREATE TABLE IF NOT EXISTS dust_and_leather_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 4 CHECK (capacity >= 2 AND capacity <= 4),
  enrolled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_dust_leather_sessions_date ON dust_and_leather_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_dust_leather_sessions_status ON dust_and_leather_sessions(status);

-- Enable RLS for sessions
ALTER TABLE dust_and_leather_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to sessions
CREATE POLICY "Service role has full access to dust and leather sessions" ON dust_and_leather_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous read access to open sessions (for registration page)
CREATE POLICY "Anyone can view open dust and leather sessions" ON dust_and_leather_sessions
  FOR SELECT USING (status = 'open');


-- Dust & Leather Bookings table (registrations)
CREATE TABLE IF NOT EXISTS dust_and_leather_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES dust_and_leather_sessions(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  confirmation_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 4),
  package_type TEXT NOT NULL CHECK (package_type IN ('day-pass', 'stay-for-fire')),
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
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_email ON dust_and_leather_bookings(email);
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_confirmation ON dust_and_leather_bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_status ON dust_and_leather_bookings(status);
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_session ON dust_and_leather_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_date ON dust_and_leather_bookings(session_date);

-- Enable RLS for bookings
ALTER TABLE dust_and_leather_bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to bookings
CREATE POLICY "Service role has full access to dust and leather bookings" ON dust_and_leather_bookings
  FOR ALL USING (auth.role() = 'service_role');


-- Function to increment enrolled count and auto-update status
CREATE OR REPLACE FUNCTION increment_dust_leather_enrolled(
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
  FROM dust_and_leather_sessions
  WHERE id = p_session_id;

  -- Update enrolled count
  UPDATE dust_and_leather_sessions
  SET
    enrolled = v_new_enrolled,
    status = CASE WHEN v_new_enrolled >= v_capacity THEN 'full' ELSE status END,
    updated_at = now()
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
