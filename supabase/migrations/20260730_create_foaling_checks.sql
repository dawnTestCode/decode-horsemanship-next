-- Create foaling_checks table for foaling watch log
CREATE TABLE foaling_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  checker_name text NOT NULL,
  udder_status text NOT NULL CHECK (udder_status IN ('none', 'filling', 'tight-full', 'waxing', 'dripping')),
  vulva_status text NOT NULL CHECK (vulva_status IN ('same', 'more-relaxed', 'very-loose')),
  behavior_flags text[] DEFAULT '{}',
  notes text,
  photo_urls text[] DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE foaling_checks ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "Allow public read access"
  ON foaling_checks
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public insert access (no auth required)
CREATE POLICY "Allow public insert access"
  ON foaling_checks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE foaling_checks;
