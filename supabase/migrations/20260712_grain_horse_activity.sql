-- Add horse activity tracking to transactions
-- Track when horses are added, edited, or removed

-- Extend transaction_type to include horse activities
ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_transaction_type_check;

ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_transaction_type_check
  CHECK (transaction_type IN ('bought', 'horse_added', 'horse_updated', 'horse_removed'));

-- Add horse_id column to track which horse was affected
ALTER TABLE grain_transactions
  ADD COLUMN IF NOT EXISTS horse_id UUID REFERENCES grain_horses(id),
  ADD COLUMN IF NOT EXISTS horse_name TEXT,
  ADD COLUMN IF NOT EXISTS details TEXT;

-- Function to record horse activity
CREATE OR REPLACE FUNCTION record_horse_activity(
  p_horse_id UUID,
  p_horse_name TEXT,
  p_activity_type TEXT,
  p_details TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  INSERT INTO grain_transactions (item_type, transaction_type, quantity, horse_id, horse_name, details, created_at)
  VALUES ('grain', p_activity_type, 0, p_horse_id, p_horse_name, p_details, now())
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
