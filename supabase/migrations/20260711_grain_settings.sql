-- Grain settings table for configurable weights
-- Stores lbs per can for each grain type, lbs per scoop for vitamins, and bag sizes

CREATE TABLE IF NOT EXISTS grain_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value DECIMAL(6,3) NOT NULL,
  setting_label TEXT NOT NULL,
  setting_unit TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Initialize default settings
INSERT INTO grain_settings (setting_key, setting_value, setting_label, setting_unit) VALUES
  ('lbs_per_can_strategy', 1.8, 'Strategy lbs/can', 'lbs'),
  ('lbs_per_can_omelene', 1.2, 'Omelene lbs/can', 'lbs'),
  ('lbs_per_can_enrich', 1.5, 'Enrich lbs/can', 'lbs'),
  ('lbs_per_scoop_vitamin', 0.1, 'Vitamin lbs/scoop', 'lbs'),
  ('bag_size_grain', 50, 'Grain bag size', 'lbs'),
  ('bag_size_vitamin', 5, 'Vitamin bag size', 'lbs')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE grain_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role has full access to grain settings' AND tablename = 'grain_settings') THEN
    CREATE POLICY "Service role has full access to grain settings" ON grain_settings
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view grain settings' AND tablename = 'grain_settings') THEN
    CREATE POLICY "Anyone can view grain settings" ON grain_settings
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update grain settings' AND tablename = 'grain_settings') THEN
    CREATE POLICY "Anyone can update grain settings" ON grain_settings
      FOR UPDATE USING (true);
  END IF;
END $$;

-- Function to update a setting
CREATE OR REPLACE FUNCTION update_grain_setting(
  p_setting_key TEXT,
  p_setting_value DECIMAL
)
RETURNS VOID AS $$
BEGIN
  UPDATE grain_settings
  SET setting_value = p_setting_value, updated_at = now()
  WHERE setting_key = p_setting_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
