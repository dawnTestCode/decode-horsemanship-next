-- Grain Tracking Tables
-- Tracks grain inventory, horse feeding schedules, and purchase history

-- Grain types enum-like values
-- strategy = Strategy Professional Gx
-- omelene = Omelene 300 Mare and Foal
-- enrich = Enrich +

-- Horse registry table
CREATE TABLE IF NOT EXISTS grain_horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grain_type TEXT NOT NULL CHECK (grain_type IN ('strategy', 'omelene', 'enrich')),
  cans_per_feeding DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  vitamin_scoops DECIMAL(3,1) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grain inventory table (current stock in bags)
CREATE TABLE IF NOT EXISTS grain_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('grain', 'vitamin')),
  grain_type TEXT CHECK (
    (item_type = 'grain' AND grain_type IN ('strategy', 'omelene', 'enrich')) OR
    (item_type = 'vitamin' AND grain_type IS NULL)
  ),
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_type, grain_type)
);

-- Initialize inventory with zero counts
INSERT INTO grain_inventory (item_type, grain_type, quantity) VALUES
  ('grain', 'strategy', 0),
  ('grain', 'omelene', 0),
  ('grain', 'enrich', 0),
  ('vitamin', NULL, 0)
ON CONFLICT (item_type, grain_type) DO NOTHING;

-- Grain transactions table (purchase history)
CREATE TABLE IF NOT EXISTS grain_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('grain', 'vitamin')),
  grain_type TEXT CHECK (
    (item_type = 'grain' AND grain_type IN ('strategy', 'omelene', 'enrich')) OR
    (item_type = 'vitamin' AND grain_type IS NULL)
  ),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('bought')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grain_horses_active ON grain_horses(active);
CREATE INDEX IF NOT EXISTS idx_grain_transactions_date ON grain_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_grain_transactions_type ON grain_transactions(item_type);

-- Enable RLS
ALTER TABLE grain_horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE grain_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE grain_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for grain_horses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to grain horses' AND tablename = 'grain_horses') THEN
    CREATE POLICY "Service role has full access to grain horses" ON grain_horses
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view grain horses' AND tablename = 'grain_horses') THEN
    CREATE POLICY "Anyone can view grain horses" ON grain_horses
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert grain horses' AND tablename = 'grain_horses') THEN
    CREATE POLICY "Anyone can insert grain horses" ON grain_horses
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update grain horses' AND tablename = 'grain_horses') THEN
    CREATE POLICY "Anyone can update grain horses" ON grain_horses
      FOR UPDATE USING (true);
  END IF;
END $$;

-- RLS Policies for grain_inventory
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to grain inventory' AND tablename = 'grain_inventory') THEN
    CREATE POLICY "Service role has full access to grain inventory" ON grain_inventory
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view grain inventory' AND tablename = 'grain_inventory') THEN
    CREATE POLICY "Anyone can view grain inventory" ON grain_inventory
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update grain inventory' AND tablename = 'grain_inventory') THEN
    CREATE POLICY "Anyone can update grain inventory" ON grain_inventory
      FOR UPDATE USING (true);
  END IF;
END $$;

-- RLS Policies for grain_transactions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to grain transactions' AND tablename = 'grain_transactions') THEN
    CREATE POLICY "Service role has full access to grain transactions" ON grain_transactions
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view grain transactions' AND tablename = 'grain_transactions') THEN
    CREATE POLICY "Anyone can view grain transactions" ON grain_transactions
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert grain transactions' AND tablename = 'grain_transactions') THEN
    CREATE POLICY "Anyone can insert grain transactions" ON grain_transactions
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Function to record grain/vitamin purchase and update inventory
CREATE OR REPLACE FUNCTION record_grain_purchase(
  p_item_type TEXT,
  p_quantity INTEGER,
  p_grain_type TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_transaction_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_created_at TIMESTAMPTZ;
BEGIN
  v_created_at := COALESCE(p_transaction_date, now());

  -- Insert transaction record
  INSERT INTO grain_transactions (item_type, grain_type, transaction_type, quantity, notes, created_at)
  VALUES (p_item_type, p_grain_type, 'bought', p_quantity, p_notes, v_created_at)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE grain_inventory
  SET quantity = quantity + p_quantity, updated_at = now()
  WHERE item_type = p_item_type
    AND ((p_grain_type IS NULL AND grain_type IS NULL) OR grain_type = p_grain_type);

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a new horse
CREATE OR REPLACE FUNCTION add_grain_horse(
  p_name TEXT,
  p_grain_type TEXT,
  p_cans_per_feeding DECIMAL DEFAULT 1.0,
  p_vitamin_scoops DECIMAL DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
  v_horse_id UUID;
BEGIN
  INSERT INTO grain_horses (name, grain_type, cans_per_feeding, vitamin_scoops)
  VALUES (p_name, p_grain_type, p_cans_per_feeding, p_vitamin_scoops)
  RETURNING id INTO v_horse_id;

  RETURN v_horse_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a horse
CREATE OR REPLACE FUNCTION update_grain_horse(
  p_id UUID,
  p_name TEXT DEFAULT NULL,
  p_grain_type TEXT DEFAULT NULL,
  p_cans_per_feeding DECIMAL DEFAULT NULL,
  p_vitamin_scoops DECIMAL DEFAULT NULL,
  p_active BOOLEAN DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE grain_horses
  SET
    name = COALESCE(p_name, name),
    grain_type = COALESCE(p_grain_type, grain_type),
    cans_per_feeding = COALESCE(p_cans_per_feeding, cans_per_feeding),
    vitamin_scoops = COALESCE(p_vitamin_scoops, vitamin_scoops),
    active = COALESCE(p_active, active),
    updated_at = now()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deactivate a horse (when sold)
CREATE OR REPLACE FUNCTION deactivate_grain_horse(p_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE grain_horses
  SET active = false, updated_at = now()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to manually adjust inventory (for corrections)
CREATE OR REPLACE FUNCTION adjust_grain_inventory(
  p_item_type TEXT,
  p_quantity INTEGER,
  p_grain_type TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE grain_inventory
  SET quantity = p_quantity, updated_at = now()
  WHERE item_type = p_item_type
    AND ((p_grain_type IS NULL AND grain_type IS NULL) OR grain_type = p_grain_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
