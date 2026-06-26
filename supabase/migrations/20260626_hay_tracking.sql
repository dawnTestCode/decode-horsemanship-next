-- Hay Tracking Tables
-- Tracks hay inventory (round bales and square bales) with acquisition and usage history

-- Hay inventory table (current stock)
CREATE TABLE IF NOT EXISTS hay_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bale_type TEXT NOT NULL CHECK (bale_type IN ('round', 'square')),
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(bale_type)
);

-- Initialize inventory with zero counts
INSERT INTO hay_inventory (bale_type, quantity) VALUES ('round', 0), ('square', 0)
ON CONFLICT (bale_type) DO NOTHING;

-- Hay transactions table (history of all hay movements)
CREATE TABLE IF NOT EXISTS hay_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bale_type TEXT NOT NULL CHECK (bale_type IN ('round', 'square')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('bought', 'used')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  -- For round bales used: which field it went to
  -- For square bales used: what it was used for
  usage_location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_hay_transactions_type ON hay_transactions(bale_type);
CREATE INDEX IF NOT EXISTS idx_hay_transactions_date ON hay_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_hay_transactions_transaction_type ON hay_transactions(transaction_type);

-- Enable RLS
ALTER TABLE hay_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE hay_transactions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to hay inventory' AND tablename = 'hay_inventory') THEN
    CREATE POLICY "Service role has full access to hay inventory" ON hay_inventory
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to hay transactions' AND tablename = 'hay_transactions') THEN
    CREATE POLICY "Service role has full access to hay transactions" ON hay_transactions
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- Allow anonymous read/write access (this is a simple internal tool, no auth needed)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view hay inventory' AND tablename = 'hay_inventory') THEN
    CREATE POLICY "Anyone can view hay inventory" ON hay_inventory
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update hay inventory' AND tablename = 'hay_inventory') THEN
    CREATE POLICY "Anyone can update hay inventory" ON hay_inventory
      FOR UPDATE USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view hay transactions' AND tablename = 'hay_transactions') THEN
    CREATE POLICY "Anyone can view hay transactions" ON hay_transactions
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert hay transactions' AND tablename = 'hay_transactions') THEN
    CREATE POLICY "Anyone can insert hay transactions" ON hay_transactions
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Function to record hay purchase and update inventory
CREATE OR REPLACE FUNCTION record_hay_purchase(
  p_bale_type TEXT,
  p_quantity INTEGER,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Insert transaction record
  INSERT INTO hay_transactions (bale_type, transaction_type, quantity, notes)
  VALUES (p_bale_type, 'bought', p_quantity, p_notes)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE hay_inventory
  SET quantity = quantity + p_quantity, updated_at = now()
  WHERE bale_type = p_bale_type;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record hay usage and update inventory
CREATE OR REPLACE FUNCTION record_hay_usage(
  p_bale_type TEXT,
  p_quantity INTEGER,
  p_usage_location TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_current_quantity INTEGER;
BEGIN
  -- Check current inventory
  SELECT quantity INTO v_current_quantity
  FROM hay_inventory
  WHERE bale_type = p_bale_type;

  IF v_current_quantity < p_quantity THEN
    RAISE EXCEPTION 'Insufficient inventory. Current % bales: %, requested: %', p_bale_type, v_current_quantity, p_quantity;
  END IF;

  -- Insert transaction record
  INSERT INTO hay_transactions (bale_type, transaction_type, quantity, usage_location, notes)
  VALUES (p_bale_type, 'used', p_quantity, p_usage_location, p_notes)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE hay_inventory
  SET quantity = quantity - p_quantity, updated_at = now()
  WHERE bale_type = p_bale_type;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
