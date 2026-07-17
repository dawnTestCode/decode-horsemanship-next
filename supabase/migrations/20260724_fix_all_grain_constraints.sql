-- Comprehensive fix for all grain_transactions constraints
-- Drop all constraints and recreate them to allow inventory_set transactions

-- Drop all existing constraints on grain_transactions
ALTER TABLE grain_transactions DROP CONSTRAINT IF EXISTS grain_transactions_grain_type_check;
ALTER TABLE grain_transactions DROP CONSTRAINT IF EXISTS grain_transactions_check;
ALTER TABLE grain_transactions DROP CONSTRAINT IF EXISTS grain_transactions_check1;
ALTER TABLE grain_transactions DROP CONSTRAINT IF EXISTS grain_transactions_quantity_check;
ALTER TABLE grain_transactions DROP CONSTRAINT IF EXISTS grain_transactions_item_type_check;
ALTER TABLE grain_transactions DROP CONSTRAINT IF EXISTS grain_transactions_transaction_type_check;

-- Make quantity nullable (it's not relevant for all transaction types)
ALTER TABLE grain_transactions ALTER COLUMN quantity DROP NOT NULL;

-- Recreate constraints with proper allowances for all transaction types
ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_item_type_check
  CHECK (item_type IN ('grain', 'vitamin'));

ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_transaction_type_check
  CHECK (transaction_type IN ('bought', 'horse_added', 'horse_updated', 'horse_removed', 'half_feeding', 'inventory_set'));

-- grain_type constraint: required for grain items on bought/inventory_set, null for vitamin
ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_grain_type_check
  CHECK (
    (item_type = 'grain' AND grain_type IN ('strategy', 'omelene', 'enrich')) OR
    (item_type = 'vitamin' AND grain_type IS NULL) OR
    (transaction_type NOT IN ('bought', 'inventory_set'))
  );

-- quantity constraint: required > 0 only for bought transactions
ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_quantity_check
  CHECK (
    (transaction_type = 'bought' AND quantity > 0) OR
    (transaction_type != 'bought')
  );
