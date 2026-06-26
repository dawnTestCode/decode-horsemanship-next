-- Add hay_type column to track different types of square bales
-- Types: fescue (regular), fescue-free, alfalfa

-- Add hay_type column to inventory (nullable for round bales, required for square)
ALTER TABLE hay_inventory ADD COLUMN IF NOT EXISTS hay_type TEXT;

-- Drop the unique constraint on bale_type and add a new one on bale_type + hay_type
ALTER TABLE hay_inventory DROP CONSTRAINT IF EXISTS hay_inventory_bale_type_key;
ALTER TABLE hay_inventory ADD CONSTRAINT hay_inventory_bale_type_hay_type_key UNIQUE (bale_type, hay_type);

-- Add hay_type column to transactions
ALTER TABLE hay_transactions ADD COLUMN IF NOT EXISTS hay_type TEXT;

-- Clear existing inventory to reset with new structure
DELETE FROM hay_inventory;

-- Insert new inventory rows for round bales (no hay_type) and each square bale type
INSERT INTO hay_inventory (bale_type, hay_type, quantity) VALUES
  ('round', NULL, 0),
  ('square', 'fescue', 0),
  ('square', 'fescue-free', 0),
  ('square', 'alfalfa', 0)
ON CONFLICT (bale_type, hay_type) DO NOTHING;

-- Update the purchase function to handle hay_type
CREATE OR REPLACE FUNCTION record_hay_purchase(
  p_bale_type TEXT,
  p_quantity INTEGER,
  p_notes TEXT DEFAULT NULL,
  p_hay_type TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Insert transaction record
  INSERT INTO hay_transactions (bale_type, transaction_type, quantity, notes, hay_type)
  VALUES (p_bale_type, 'bought', p_quantity, p_notes, p_hay_type)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE hay_inventory
  SET quantity = quantity + p_quantity, updated_at = now()
  WHERE bale_type = p_bale_type
    AND (hay_type = p_hay_type OR (hay_type IS NULL AND p_hay_type IS NULL));

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the usage function to handle hay_type
CREATE OR REPLACE FUNCTION record_hay_usage(
  p_bale_type TEXT,
  p_quantity INTEGER,
  p_usage_location TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_hay_type TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_current_quantity INTEGER;
BEGIN
  -- Check current inventory
  SELECT quantity INTO v_current_quantity
  FROM hay_inventory
  WHERE bale_type = p_bale_type
    AND (hay_type = p_hay_type OR (hay_type IS NULL AND p_hay_type IS NULL));

  IF v_current_quantity < p_quantity THEN
    RAISE EXCEPTION 'Insufficient inventory. Current % bales: %, requested: %', p_bale_type, v_current_quantity, p_quantity;
  END IF;

  -- Insert transaction record
  INSERT INTO hay_transactions (bale_type, transaction_type, quantity, usage_location, notes, hay_type)
  VALUES (p_bale_type, 'used', p_quantity, p_usage_location, p_notes, p_hay_type)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE hay_inventory
  SET quantity = quantity - p_quantity, updated_at = now()
  WHERE bale_type = p_bale_type
    AND (hay_type = p_hay_type OR (hay_type IS NULL AND p_hay_type IS NULL));

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
