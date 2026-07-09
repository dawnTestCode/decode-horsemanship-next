-- Fix constraints to allow horse activity tracking
-- The original constraints were too strict for activity records

-- Drop the old grain_type constraint
ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_grain_type_check;

-- Add a more flexible constraint that allows NULL grain_type for horse activities
ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_grain_type_check
  CHECK (
    (item_type = 'grain' AND transaction_type = 'bought' AND grain_type IN ('strategy', 'omelene', 'enrich')) OR
    (item_type = 'vitamin' AND grain_type IS NULL) OR
    (transaction_type IN ('horse_added', 'horse_updated', 'horse_removed'))
  );

-- Drop the quantity > 0 constraint and replace with one that allows 0 for activities
ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_quantity_check;

ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_quantity_check
  CHECK (
    (transaction_type = 'bought' AND quantity > 0) OR
    (transaction_type IN ('horse_added', 'horse_updated', 'horse_removed') AND quantity >= 0)
  );
