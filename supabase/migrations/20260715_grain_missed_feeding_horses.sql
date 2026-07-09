-- Function to record a missed feeding for a specific horse
CREATE OR REPLACE FUNCTION record_half_feeding_for_horse(
  p_horse_id UUID,
  p_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_created_at TIMESTAMPTZ;
  v_horse_name TEXT;
BEGIN
  v_created_at := COALESCE(p_date, now());

  -- Get horse name for the details
  SELECT name INTO v_horse_name
  FROM grain_horses
  WHERE id = p_horse_id;

  INSERT INTO grain_transactions (item_type, transaction_type, quantity, details, created_at)
  VALUES ('grain', 'half_feeding', 0, v_horse_name || ' missed feeding', v_created_at)
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old array version if it exists
DROP FUNCTION IF EXISTS record_half_feeding_for_horses(UUID[], TIMESTAMPTZ);
