-- Add half_feeding transaction type for days when horses only ate once
ALTER TABLE grain_transactions
  DROP CONSTRAINT IF EXISTS grain_transactions_transaction_type_check;

ALTER TABLE grain_transactions
  ADD CONSTRAINT grain_transactions_transaction_type_check
  CHECK (transaction_type IN ('bought', 'horse_added', 'horse_updated', 'horse_removed', 'half_feeding'));

-- Function to record a half feeding day
CREATE OR REPLACE FUNCTION record_half_feeding(
  p_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_created_at TIMESTAMPTZ;
BEGIN
  v_created_at := COALESCE(p_date, now());

  INSERT INTO grain_transactions (item_type, transaction_type, quantity, details, created_at)
  VALUES ('grain', 'half_feeding', 0, 'Horses fed once', v_created_at)
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
