-- GotFences Outreach Tables
-- Run this in Supabase SQL Editor

-- 1. Create fence_contacts table
CREATE TABLE fence_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT,
  category TEXT CHECK (category IN ('realtor', 'ag_lender', 'extension', 'veterinarian', 'farrier', 'feed_store', 'hoa', 'community_group', 'other')),
  main_phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'active')),
  priority BOOLEAN DEFAULT false,
  scheduled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create fence_contact_logs table
CREATE TABLE fence_contact_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fence_contact_id UUID REFERENCES fence_contacts(id) ON DELETE CASCADE,
  contact_type TEXT CHECK (contact_type IN ('visited', 'cold_called', 'emailed', 'other')),
  contacted_by TEXT,
  contact_date DATE NOT NULL,
  summary TEXT NOT NULL,
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create fence_outreach_scripts table
CREATE TABLE fence_outreach_scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create view for contacts with last contact info
CREATE VIEW fence_contacts_with_last_contact AS
SELECT
  c.*,
  l.contact_type AS last_contact_type,
  l.contact_date AS last_contact_date,
  l.summary AS last_contact_summary,
  l.direction AS last_contact_direction
FROM fence_contacts c
LEFT JOIN LATERAL (
  SELECT * FROM fence_contact_logs
  WHERE fence_contact_id = c.id
  ORDER BY contact_date DESC, created_at DESC
  LIMIT 1
) l ON true;

-- 5. Enable RLS (Row Level Security)
ALTER TABLE fence_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fence_contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fence_outreach_scripts ENABLE ROW LEVEL SECURITY;

-- 6. Create policies (allow all for authenticated users, adjust as needed)
CREATE POLICY "Allow all for authenticated" ON fence_contacts FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON fence_contact_logs FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON fence_outreach_scripts FOR ALL USING (true);

-- ============================================================
-- IMPORT DATA FROM SPREADSHEET
-- ============================================================

INSERT INTO fence_contacts (name, business_name, category, main_phone, email, address, notes, status) VALUES
-- Real Estate Agents
('Ann Cavallito', 'Independent (Triangle)', 'realtor', '919-357-6678', 'jcavallito@gmail.com', 'Durham, Chapel Hill, Raleigh, Hillsborough, Chatham County', '30+ years experience, owns horses herself, uses ''Stable Realtor'' branding - likely strongest first outreach', 'prospect'),
('Malia Jarrett', 'Mallard Realty Group / Triangle House Hunter', 'realtor', '919-696-4254', NULL, 'Raleigh/Durham/Chapel Hill area', 'Lives on a horse farm herself; personally walks every listing - would notice fencing condition', 'prospect'),
('Sandy Savage', 'Homes and Horses / Carolina One Realty', 'realtor', '919-444-3699', 'Sandy@HomesAndHorsesNC.com', 'Chatham, Wake, Durham counties (Pittsboro-based)', 'Owns Quiet Meadow Farm (hunter/jumper) with husband, a professional horse trainer - very strong fit', 'prospect'),
('Frank Gombatz', 'Legacy Farms and Ranches of NC (Long & Foster)', 'realtor', '919-696-4249', NULL, 'Statewide NC', 'Strong reputation for rural/farm property sales', 'prospect'),
('Gardner Reynolds', 'Legacy Farms and Ranches of NC (Long & Foster)', 'realtor', '919-749-3177', NULL, 'Statewide NC', 'Co-broker with Frank Gombatz', 'prospect'),
('Ellen Pitts', 'Harmony Realty (Keller Williams Raleigh affiliate)', 'realtor', '919-725-1885', 'ellen@harmonyrealtytriangle.com', 'Wake, Durham, Orange, Chatham counties', 'Niche farm/hobby farm listing service, 2-acre minimum - Orange County overlap with us', 'prospect'),
('Lara Murphy', 'Carolina Horse Farm Realty / eXp Realty Land & Ranch', 'realtor', '704-929-3289', 'info@carolinahorsefarmrealty.com', 'NC & SC, concentrated near Tryon/Union/Polk/Iredell', 'Mooresville-based; dual NC+SC licensed, 15+ years, 150+ properties sold', 'prospect'),

-- Ag Lenders
('Farm Credit of the Carolinas', 'AgSouth Farm Credit, Graham Branch', 'ag_lender', '336-661-1263', NULL, '225 N Main St, Graham NC 27253', 'Covers our whole service area (Orange, Chatham, Durham counties)', 'prospect'),
('USDA FSA Durham/Orange', 'USDA Farm Service Agency', 'ag_lender', '919-732-4301', NULL, '306 Revere Rd Ste D, Hillsborough NC 27278', 'Orange & Durham county office', 'prospect'),
('USDA FSA Chatham', 'USDA Farm Service Agency', 'ag_lender', '919-542-2244', NULL, '1192 US 64W Business Suite 212, Pittsboro NC 27312', 'Chatham county office', 'prospect'),

-- Extension Agents
('Alex Kissinger', 'NC Cooperative Extension - Orange County Center', 'extension', '919-245-2050', 'alex_kissinger@ncsu.edu', 'PO Box 8181, Hillsborough NC 27278', 'Works with livestock and forage producers, ponds, soil samples, 4-H livestock programs. Also covers Durham', 'prospect'),
('Dalton Suits', 'NC Cooperative Extension - Chatham County Center', 'extension', '919-542-8202', NULL, 'Chatham County Agriculture & Conference Center, Pittsboro', 'Covers equine specifically - strong fit', 'prospect'),
('John Lyttle', 'NC Cooperative Extension - Durham County Center', 'extension', '919-560-0525', 'john_lyttle@ncsu.edu', 'Durham County', 'Good contact point for new/beginner small-acreage owners in Durham', 'prospect'),

-- Veterinarians
('Chapel Hill Equine Associates', NULL, 'veterinarian', '919-932-5225', NULL, 'Chapel Hill (27515/27517)', 'Local equine-specific practice; Dr. Jack Shuler among associates', 'prospect'),
('Triangle Equine Veterinary Services', NULL, 'veterinarian', '919-460-6300', NULL, 'Based in Cary; covers Raleigh, Chapel Hill, Durham, Hillsborough, Pittsboro, Apex', 'Founded 2001 by Dr. Sally Vivrette; 100% mobile, routine + 24/7 emergency care', 'prospect'),
('Dr. Jennifer Godman', 'IVMS Equine', 'veterinarian', NULL, NULL, 'Chapel Hill, Hillsborough, Pittsboro and statewide', 'Sports medicine/rehab focus; mobile practice - no direct phone found yet, has online contact form', 'prospect'),

-- Farriers
('Joe Eisen', 'Joe Eisen Farrier Service LLC', 'farrier', '919-408-7268', NULL, 'Chapel Hill, within ~30 miles', 'Active in Chapel Hill farrier community since 2015, trims/shoes', 'prospect'),
('Wilkinson Farriery Service', NULL, 'farrier', '336-437-4559', NULL, 'Hillsborough / Orange County', '28 years experience, natural barefoot trimming and corrective shoeing', 'prospect'),

-- Feed/Tack Stores
('Piedmont Feed & Garden Center', NULL, 'feed_store', '919-942-7848', NULL, '4805 NC Hwy 54 W, Chapel Hill (near Carrboro)', 'Family-owned 30+ years, full line of feed/bedding/livestock supplies', 'prospect'),
('Pittsboro Feed', NULL, 'feed_store', '919-542-2454', 'support@pittsborofeed.com', '1245 Thompson St, Pittsboro', 'Owned by David & Christine (since 1992); weekly delivery service', 'prospect'),
('B-Bar Farm & Tack Shop', NULL, 'feed_store', '919-270-6417', 'carolynbbar@gmail.com', '3918 Bivins Rd, Hillsborough', 'Owners Carolyn & Todd; also offers boarding, lessons, camps - good community hub, 50 yrs in community', 'prospect'),
('Barnes Supply Co.', NULL, 'feed_store', NULL, NULL, '774 9th Street, Durham', 'No direct phone found yet', 'prospect'),

-- HOAs
('Black Horse Run POA', NULL, 'hoa', '919-847-3131', 'bhrpoa@bellsouth.net', 'Raleigh (Wake County)', 'Office hours Mon-Wed 9am-3pm', 'prospect'),
('Portofino Equestrian Center', NULL, 'hoa', '919-359-9090', 'PortofinoEquestrianCenter@gmail.com', 'Clayton, NC (Johnston County)', 'HOA itself uses Vision Community Management; this is the on-site equestrian center contact', 'prospect'),
('The Trails (Chapel Hill)', 'HOAM (Highrise Owners Association Management)', 'hoa', '208-352-8499', 'arothrock@welcome-home.com', 'Chapel Hill (Orange County)', 'Managed by HOAM; HOA manager contact for urgent/community matters', 'prospect'),

-- Other / To Research
('Farm/livestock insurance agents', NULL, 'other', NULL, NULL, 'Local', 'Many policies require fencing in good condition for liability coverage - need specific local agent names', 'prospect'),
('County land surveyors', NULL, 'other', NULL, NULL, 'Orange/Chatham/Durham counties', 'Often first call a new rural buyer makes - need specific local names', 'prospect'),
('Well & septic contractors', NULL, 'other', NULL, NULL, 'Local', 'See the property before most other vendors - need specific local names', 'prospect'),
('NC FarmLink', NULL, 'other', NULL, NULL, 'Statewide NC', 'Connects new/beginner farmers to land - worth requesting a vendor listing; Eastern Director Noah Ranells based out of Chatham/Horticultural Science', 'prospect'),

-- Community Groups
('Chatham County Homesteaders', 'Facebook Group', 'community_group', NULL, NULL, 'Chatham County', 'Direct source of fencing recommendation requests', 'prospect'),
('Triangle Horse People', 'Facebook Group', 'community_group', NULL, NULL, 'Triangle area', 'Facebook community group', 'prospect');
