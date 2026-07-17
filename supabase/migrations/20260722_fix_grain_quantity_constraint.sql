-- Fix quantity constraint to allow 0 for inventory_set transactions
-- The original constraint required quantity > 0 which breaks inventory_set

-- Drop the old constraint
ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_quantity_check;

-- Add a new constraint that allows 0 for non-bought transactions
ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_quantity_check
  CHECK (
    (transaction_type = 'bought' AND quantity > 0) OR
    (transaction_type != 'bought' AND quantity >= 0)
  );

-- Also need to allow NULL for quantity on non-bought transactions
ALTER TABLE grain_transactions
  ALTER COLUMN quantity DROP NOT NULL;

-- Update the set_grain_inventory_bags function to use ROUND instead of INTEGER cast
-- and store the actual bag count (not truncated)
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

  -- Record the adjustment (use ROUND to get nearest integer, minimum 1 for display)
  INSERT INTO grain_transactions (item_type, grain_type, transaction_type, quantity, details, created_at)
  VALUES ('grain', p_grain_type, 'inventory_set', GREATEST(1, ROUND(p_bags)::INTEGER), 'Inventory set to ' || p_bags || ' bags', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the set_vitamin_inventory_bags function similarly
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
  VALUES ('vitamin', 'inventory_set', GREATEST(1, ROUND(p_bags)::INTEGER), 'Inventory set to ' || p_bags || ' bags', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
