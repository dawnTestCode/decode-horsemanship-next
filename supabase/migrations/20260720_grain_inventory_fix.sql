-- Fix grain inventory model
-- Previously, inventory was calculated from transactions which was incorrect.
-- Now, inventory is stored directly in grain_inventory table.
-- Missed feedings will update inventory by adding back saved grain.
-- Purchases still update inventory.

-- Add lbs_saved columns to grain_transactions for missed feedings
-- This stores the actual amount saved at the time of recording
ALTER TABLE grain_transactions
  ADD COLUMN IF NOT EXISTS strategy_lbs_saved DECIMAL(8,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS omelene_lbs_saved DECIMAL(8,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enrich_lbs_saved DECIMAL(8,3) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vitamin_lbs_saved DECIMAL(8,3) DEFAULT 0;

-- Change grain_inventory quantity to DECIMAL for precision (lbs instead of bags)
-- We need to store in lbs for accurate tracking
ALTER TABLE grain_inventory
  ALTER COLUMN quantity TYPE DECIMAL(10,3);

-- Add transaction type for inventory adjustments
ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_transaction_type_check;

ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_transaction_type_check
  CHECK (transaction_type IN ('bought', 'horse_added', 'horse_updated', 'horse_removed', 'half_feeding', 'inventory_set'));

-- Function to set inventory directly (in bags, converted to lbs internally)
CREATE OR REPLACE FUNCTION set_grain_inventory_bags(
  p_grain_type TEXT,
  p_bags DECIMAL,
  p_bag_size_lbs DECIMAL DEFAULT 50
)
RETURNS VOID AS $$
DECLARE
  v_lbs DECIMAL;
BEGIN
  v_lbs := p_bags * p_bag_size_lbs;

  UPDATE grain_inventory
  SET quantity = v_lbs, updated_at = now()
  WHERE item_type = 'grain' AND grain_type = p_grain_type;

  -- Record the adjustment
  INSERT INTO grain_transactions (item_type, grain_type, transaction_type, quantity, details, created_at)
  VALUES ('grain', p_grain_type, 'inventory_set', p_bags::INTEGER, 'Inventory set to ' || p_bags || ' bags', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set vitamin inventory (in bags, converted to lbs)
CREATE OR REPLACE FUNCTION set_vitamin_inventory_bags(
  p_bags DECIMAL,
  p_bag_size_lbs DECIMAL DEFAULT 5
)
RETURNS VOID AS $$
DECLARE
  v_lbs DECIMAL;
BEGIN
  v_lbs := p_bags * p_bag_size_lbs;

  UPDATE grain_inventory
  SET quantity = v_lbs, updated_at = now()
  WHERE item_type = 'vitamin' AND grain_type IS NULL;

  -- Record the adjustment
  INSERT INTO grain_transactions (item_type, transaction_type, quantity, details, created_at)
  VALUES ('vitamin', 'inventory_set', p_bags::INTEGER, 'Inventory set to ' || p_bags || ' bags', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated function to record half feeding for ALL horses
-- Now calculates and stores the actual lbs saved, and updates inventory
CREATE OR REPLACE FUNCTION record_half_feeding(
  p_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_created_at TIMESTAMPTZ;
  v_strategy_lbs DECIMAL := 0;
  v_omelene_lbs DECIMAL := 0;
  v_enrich_lbs DECIMAL := 0;
  v_vitamin_lbs DECIMAL := 0;
  v_horse RECORD;
  v_lbs_per_can DECIMAL;
  v_settings RECORD;
BEGIN
  v_created_at := COALESCE(p_date, now());

  -- Get settings
  SELECT
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_strategy'), 1.8) as lbs_strategy,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_omelene'), 1.2) as lbs_omelene,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_enrich'), 1.5) as lbs_enrich,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_scoop_vitamin'), 0.1) as lbs_vitamin
  INTO v_settings;

  -- Calculate total lbs saved for each grain type from all active horses
  FOR v_horse IN SELECT * FROM grain_horses WHERE active = true LOOP
    CASE v_horse.grain_type
      WHEN 'strategy' THEN
        v_strategy_lbs := v_strategy_lbs + (v_horse.cans_per_feeding * v_settings.lbs_strategy);
      WHEN 'omelene' THEN
        v_omelene_lbs := v_omelene_lbs + (v_horse.cans_per_feeding * v_settings.lbs_omelene);
      WHEN 'enrich' THEN
        v_enrich_lbs := v_enrich_lbs + (v_horse.cans_per_feeding * v_settings.lbs_enrich);
    END CASE;
    v_vitamin_lbs := v_vitamin_lbs + (v_horse.vitamin_scoops * v_settings.lbs_vitamin);
  END LOOP;

  -- Insert transaction with actual saved amounts
  INSERT INTO grain_transactions (
    item_type, transaction_type, quantity, details, created_at,
    strategy_lbs_saved, omelene_lbs_saved, enrich_lbs_saved, vitamin_lbs_saved
  )
  VALUES (
    'grain', 'half_feeding', 0, 'Horses fed once', v_created_at,
    v_strategy_lbs, v_omelene_lbs, v_enrich_lbs, v_vitamin_lbs
  )
  RETURNING id INTO v_transaction_id;

  -- Update inventory (add back saved grain)
  UPDATE grain_inventory SET quantity = quantity + v_strategy_lbs, updated_at = now()
  WHERE item_type = 'grain' AND grain_type = 'strategy';

  UPDATE grain_inventory SET quantity = quantity + v_omelene_lbs, updated_at = now()
  WHERE item_type = 'grain' AND grain_type = 'omelene';

  UPDATE grain_inventory SET quantity = quantity + v_enrich_lbs, updated_at = now()
  WHERE item_type = 'grain' AND grain_type = 'enrich';

  UPDATE grain_inventory SET quantity = quantity + v_vitamin_lbs, updated_at = now()
  WHERE item_type = 'vitamin' AND grain_type IS NULL;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated function to record half feeding for a SPECIFIC horse
CREATE OR REPLACE FUNCTION record_half_feeding_for_horse(
  p_horse_id UUID,
  p_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_created_at TIMESTAMPTZ;
  v_horse RECORD;
  v_lbs_saved DECIMAL;
  v_vitamin_lbs_saved DECIMAL;
  v_settings RECORD;
BEGIN
  v_created_at := COALESCE(p_date, now());

  -- Get horse details
  SELECT * INTO v_horse FROM grain_horses WHERE id = p_horse_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Horse not found';
  END IF;

  -- Get settings
  SELECT
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_strategy'), 1.8) as lbs_strategy,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_omelene'), 1.2) as lbs_omelene,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_enrich'), 1.5) as lbs_enrich,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_scoop_vitamin'), 0.1) as lbs_vitamin
  INTO v_settings;

  -- Calculate lbs saved based on grain type
  CASE v_horse.grain_type
    WHEN 'strategy' THEN
      v_lbs_saved := v_horse.cans_per_feeding * v_settings.lbs_strategy;
    WHEN 'omelene' THEN
      v_lbs_saved := v_horse.cans_per_feeding * v_settings.lbs_omelene;
    WHEN 'enrich' THEN
      v_lbs_saved := v_horse.cans_per_feeding * v_settings.lbs_enrich;
    ELSE
      v_lbs_saved := 0;
  END CASE;

  v_vitamin_lbs_saved := v_horse.vitamin_scoops * v_settings.lbs_vitamin;

  -- Insert transaction with actual saved amounts
  INSERT INTO grain_transactions (
    item_type, grain_type, transaction_type, quantity, details, created_at,
    strategy_lbs_saved, omelene_lbs_saved, enrich_lbs_saved, vitamin_lbs_saved
  )
  VALUES (
    'grain', v_horse.grain_type, 'half_feeding', 0, v_horse.name || ' missed feeding', v_created_at,
    CASE WHEN v_horse.grain_type = 'strategy' THEN v_lbs_saved ELSE 0 END,
    CASE WHEN v_horse.grain_type = 'omelene' THEN v_lbs_saved ELSE 0 END,
    CASE WHEN v_horse.grain_type = 'enrich' THEN v_lbs_saved ELSE 0 END,
    v_vitamin_lbs_saved
  )
  RETURNING id INTO v_transaction_id;

  -- Update inventory (add back saved grain)
  UPDATE grain_inventory SET quantity = quantity + v_lbs_saved, updated_at = now()
  WHERE item_type = 'grain' AND grain_type = v_horse.grain_type;

  UPDATE grain_inventory SET quantity = quantity + v_vitamin_lbs_saved, updated_at = now()
  WHERE item_type = 'vitamin' AND grain_type IS NULL;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update record_grain_purchase to store in lbs
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
  v_lbs DECIMAL;
  v_bag_size DECIMAL;
BEGIN
  v_created_at := COALESCE(p_transaction_date, now());

  -- Get bag size from settings
  IF p_item_type = 'grain' THEN
    SELECT COALESCE(setting_value, 50) INTO v_bag_size
    FROM grain_settings WHERE setting_key = 'bag_size_grain';
    IF v_bag_size IS NULL THEN v_bag_size := 50; END IF;
  ELSE
    SELECT COALESCE(setting_value, 5) INTO v_bag_size
    FROM grain_settings WHERE setting_key = 'bag_size_vitamin';
    IF v_bag_size IS NULL THEN v_bag_size := 5; END IF;
  END IF;

  v_lbs := p_quantity * v_bag_size;

  -- Insert transaction record
  INSERT INTO grain_transactions (item_type, grain_type, transaction_type, quantity, notes, created_at)
  VALUES (p_item_type, p_grain_type, 'bought', p_quantity, p_notes, v_created_at)
  RETURNING id INTO v_transaction_id;

  -- Update inventory (now in lbs)
  UPDATE grain_inventory
  SET quantity = quantity + v_lbs, updated_at = now()
  WHERE item_type = p_item_type
    AND ((p_grain_type IS NULL AND grain_type IS NULL) OR grain_type = p_grain_type);

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct daily feeding from inventory
-- Call this once per day (or manually when needed)
CREATE OR REPLACE FUNCTION deduct_daily_feeding()
RETURNS VOID AS $$
DECLARE
  v_horse RECORD;
  v_lbs_used DECIMAL;
  v_settings RECORD;
  v_strategy_total DECIMAL := 0;
  v_omelene_total DECIMAL := 0;
  v_enrich_total DECIMAL := 0;
  v_vitamin_total DECIMAL := 0;
BEGIN
  -- Get settings
  SELECT
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_strategy'), 1.8) as lbs_strategy,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_omelene'), 1.2) as lbs_omelene,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_can_enrich'), 1.5) as lbs_enrich,
    COALESCE((SELECT setting_value FROM grain_settings WHERE setting_key = 'lbs_per_scoop_vitamin'), 0.1) as lbs_vitamin
  INTO v_settings;

  -- Calculate total daily usage (2 feedings per day)
  FOR v_horse IN SELECT * FROM grain_horses WHERE active = true LOOP
    CASE v_horse.grain_type
      WHEN 'strategy' THEN
        v_strategy_total := v_strategy_total + (v_horse.cans_per_feeding * 2 * v_settings.lbs_strategy);
      WHEN 'omelene' THEN
        v_omelene_total := v_omelene_total + (v_horse.cans_per_feeding * 2 * v_settings.lbs_omelene);
      WHEN 'enrich' THEN
        v_enrich_total := v_enrich_total + (v_horse.cans_per_feeding * 2 * v_settings.lbs_enrich);
    END CASE;
    v_vitamin_total := v_vitamin_total + (v_horse.vitamin_scoops * 2 * v_settings.lbs_vitamin);
  END LOOP;

  -- Deduct from inventory (don't go below 0)
  UPDATE grain_inventory
  SET quantity = GREATEST(0, quantity - v_strategy_total), updated_at = now()
  WHERE item_type = 'grain' AND grain_type = 'strategy';

  UPDATE grain_inventory
  SET quantity = GREATEST(0, quantity - v_omelene_total), updated_at = now()
  WHERE item_type = 'grain' AND grain_type = 'omelene';

  UPDATE grain_inventory
  SET quantity = GREATEST(0, quantity - v_enrich_total), updated_at = now()
  WHERE item_type = 'grain' AND grain_type = 'enrich';

  UPDATE grain_inventory
  SET quantity = GREATEST(0, quantity - v_vitamin_total), updated_at = now()
  WHERE item_type = 'vitamin' AND grain_type IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current inventory in bags
CREATE OR REPLACE FUNCTION get_grain_inventory_bags()
RETURNS TABLE (
  item_type TEXT,
  grain_type TEXT,
  quantity_lbs DECIMAL,
  quantity_bags DECIMAL
) AS $$
DECLARE
  v_grain_bag_size DECIMAL;
  v_vitamin_bag_size DECIMAL;
BEGIN
  SELECT COALESCE(setting_value, 50) INTO v_grain_bag_size
  FROM grain_settings WHERE setting_key = 'bag_size_grain';
  IF v_grain_bag_size IS NULL THEN v_grain_bag_size := 50; END IF;

  SELECT COALESCE(setting_value, 5) INTO v_vitamin_bag_size
  FROM grain_settings WHERE setting_key = 'bag_size_vitamin';
  IF v_vitamin_bag_size IS NULL THEN v_vitamin_bag_size := 5; END IF;

  RETURN QUERY
  SELECT
    gi.item_type,
    gi.grain_type,
    gi.quantity as quantity_lbs,
    CASE
      WHEN gi.item_type = 'grain' THEN gi.quantity / v_grain_bag_size
      ELSE gi.quantity / v_vitamin_bag_size
    END as quantity_bags
  FROM grain_inventory gi;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
