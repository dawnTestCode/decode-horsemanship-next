-- Groundwork Sessions table (admin-managed dates)
CREATE TABLE IF NOT EXISTS groundwork_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '08:30',
  end_time TIME NOT NULL DEFAULT '16:00',
  capacity INTEGER NOT NULL DEFAULT 8,
  enrolled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying open sessions
CREATE INDEX IF NOT EXISTS idx_groundwork_sessions_date ON groundwork_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_groundwork_sessions_status ON groundwork_sessions(status);

-- Groundwork Registrations table
CREATE TABLE IF NOT EXISTS groundwork_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_code TEXT NOT NULL UNIQUE,
  session_date TEXT NOT NULL,  -- Can be 'TBA' or a date string
  session_id UUID REFERENCES groundwork_sessions(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age_range TEXT,
  referral_source TEXT,
  horse_experience TEXT,
  anything_to_know TEXT,
  what_brought_you TEXT,
  deposit_amount INTEGER NOT NULL,  -- in cents
  total_price INTEGER NOT NULL,     -- in cents
  balance_due INTEGER NOT NULL,     -- in cents
  deposit_paid_at TIMESTAMPTZ,
  balance_paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'deposit_paid' CHECK (status IN ('deposit_paid', 'paid_in_full', 'cancelled', 'refunded')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_groundwork_registrations_email ON groundwork_registrations(email);
CREATE INDEX IF NOT EXISTS idx_groundwork_registrations_confirmation ON groundwork_registrations(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_groundwork_registrations_session ON groundwork_registrations(session_id);

-- Enable RLS
ALTER TABLE groundwork_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE groundwork_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read of open sessions (for registration form)
CREATE POLICY "Public can read open sessions" ON groundwork_sessions
  FOR SELECT USING (status = 'open' AND session_date >= CURRENT_DATE);

-- Allow service role full access
CREATE POLICY "Service role has full access to sessions" ON groundwork_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to registrations" ON groundwork_registrations
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Add Groundwork and Dust & Leather to programs table ─────────────────────
-- These entries allow pricing to be managed via Admin → Programs → Programs & Pricing

INSERT INTO programs (slug, name, category, description, deposit_only, deposit_amount, full_price, price_label, active, scheduling)
VALUES
  ('groundwork', 'Groundwork', 'mens', 'A day with horses for men', true, 20000, 85000, '$850 per person', true, 'preset'),
  ('dust-and-leather', 'Dust & Leather', 'mens', 'A day at Decode Horsemanship for men', false, NULL, 72500, 'From $725', true, 'preset')
ON CONFLICT (slug) DO UPDATE SET
  deposit_only = EXCLUDED.deposit_only,
  deposit_amount = EXCLUDED.deposit_amount,
  full_price = EXCLUDED.full_price,
  price_label = EXCLUDED.price_label;

-- ─── Dust & Leather Packages table ───────────────────────────────────────────
-- Allows package pricing to be managed via admin

CREATE TABLE IF NOT EXISTS dust_leather_packages (
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
INSERT INTO dust_leather_packages (slug, name, description, price, sort_order)
VALUES
  ('day-pass', 'Day Pass', 'From sunup to four-thirty', 72500, 1),
  ('stay-for-fire', 'Stay for the Fire', 'Until the cards are done', 89500, 2)
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Enable RLS
ALTER TABLE dust_leather_packages ENABLE ROW LEVEL SECURITY;

-- Public read for active packages
CREATE POLICY "Public can read active packages" ON dust_leather_packages
  FOR SELECT USING (active = true);

-- Service role full access
CREATE POLICY "Service role has full access to packages" ON dust_leather_packages
  FOR ALL USING (auth.role() = 'service_role');
