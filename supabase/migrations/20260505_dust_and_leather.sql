-- Dust & Leather Bookings table
CREATE TABLE IF NOT EXISTS dust_and_leather_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  party_size INTEGER NOT NULL CHECK (party_size >= 2 AND party_size <= 4),
  package_type TEXT NOT NULL CHECK (package_type IN ('day-pass', 'stay-for-fire')),
  message TEXT,
  amount_paid INTEGER NOT NULL,  -- in cents
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'cancelled', 'refunded', 'completed')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  booked_date DATE,  -- Set by horseman after coordinating
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_email ON dust_and_leather_bookings(email);
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_confirmation ON dust_and_leather_bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_status ON dust_and_leather_bookings(status);

-- Enable RLS
ALTER TABLE dust_and_leather_bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to dust and leather bookings" ON dust_and_leather_bookings
  FOR ALL USING (auth.role() = 'service_role');
