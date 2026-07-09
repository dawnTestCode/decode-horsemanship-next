-- Function to record a missed feeding for specific horses
CREATE OR REPLACE FUNCTION record_half_feeding_for_horses(
  p_horse_ids UUID[],
  p_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_created_at TIMESTAMPTZ;
  v_horse_names TEXT;
BEGIN
  v_created_at := COALESCE(p_date, now());

  -- Get horse names for the details
  SELECT string_agg(name, ', ' ORDER BY name)
  INTO v_horse_names
  FROM grain_horses
  WHERE id = ANY(p_horse_ids);

  INSERT INTO grain_transactions (item_type, transaction_type, quantity, details, created_at)
  VALUES ('grain', 'half_feeding', 0, v_horse_names || ' missed feeding', v_created_at)
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
