-- Update functions to accept an optional transaction date parameter
-- This allows backdating transactions when recording them later

-- Update the purchase function to accept a date
CREATE OR REPLACE FUNCTION record_hay_purchase(
  p_bale_type TEXT,
  p_quantity INTEGER,
  p_notes TEXT DEFAULT NULL,
  p_hay_type TEXT DEFAULT NULL,
  p_transaction_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_date TIMESTAMPTZ;
BEGIN
  -- Use provided date or default to now
  v_date := COALESCE(p_transaction_date, now());

  -- Insert transaction record
  INSERT INTO hay_transactions (bale_type, transaction_type, quantity, notes, hay_type, created_at)
  VALUES (p_bale_type, 'bought', p_quantity, p_notes, p_hay_type, v_date)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE hay_inventory
  SET quantity = quantity + p_quantity, updated_at = now()
  WHERE bale_type = p_bale_type
    AND (hay_type = p_hay_type OR (hay_type IS NULL AND p_hay_type IS NULL));

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the usage function to accept a date
CREATE OR REPLACE FUNCTION record_hay_usage(
  p_bale_type TEXT,
  p_quantity INTEGER,
  p_usage_location TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_hay_type TEXT DEFAULT NULL,
  p_transaction_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_current_quantity INTEGER;
  v_date TIMESTAMPTZ;
BEGIN
  -- Use provided date or default to now
  v_date := COALESCE(p_transaction_date, now());

  -- Check current inventory
  SELECT quantity INTO v_current_quantity
  FROM hay_inventory
  WHERE bale_type = p_bale_type
    AND (hay_type = p_hay_type OR (hay_type IS NULL AND p_hay_type IS NULL));

  IF v_current_quantity < p_quantity THEN
    RAISE EXCEPTION 'Insufficient inventory. Current % bales: %, requested: %', p_bale_type, v_current_quantity, p_quantity;
  END IF;

  -- Insert transaction record
  INSERT INTO hay_transactions (bale_type, transaction_type, quantity, usage_location, notes, hay_type, created_at)
  VALUES (p_bale_type, 'used', p_quantity, p_usage_location, p_notes, p_hay_type, v_date)
  RETURNING id INTO v_transaction_id;

  -- Update inventory
  UPDATE hay_inventory
  SET quantity = quantity - p_quantity, updated_at = now()
  WHERE bale_type = p_bale_type
    AND (hay_type = p_hay_type OR (hay_type IS NULL AND p_hay_type IS NULL));

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
