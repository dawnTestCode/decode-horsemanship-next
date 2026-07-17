-- Fix the quantity check constraint - the constraint has a different name than expected
-- Drop ALL possible constraint names

ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_quantity_check;

ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_check;

ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_check1;

-- Make quantity nullable
ALTER TABLE grain_transactions
  ALTER COLUMN quantity DROP NOT NULL;

-- Add back a constraint that allows NULL and 0 for non-bought transactions
ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_quantity_check
  CHECK (
    quantity IS NULL OR
    (transaction_type = 'bought' AND quantity > 0) OR
    (transaction_type != 'bought')
  );

-- Update the functions to not insert quantity for inventory_set
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

  -- Record the adjustment without quantity (it's in the details)
  INSERT INTO grain_transactions (item_type, grain_type, transaction_type, details, created_at)
  VALUES ('grain', p_grain_type, 'inventory_set', 'Inventory set to ' || p_bags || ' bags', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

  -- Record the adjustment without quantity
  INSERT INTO grain_transactions (item_type, transaction_type, details, created_at)
  VALUES ('vitamin', 'inventory_set', 'Inventory set to ' || p_bags || ' bags', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
