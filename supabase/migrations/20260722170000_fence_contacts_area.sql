-- Add area column to fence_contacts
ALTER TABLE fence_contacts ADD COLUMN IF NOT EXISTS area TEXT;

-- Update the view to include area
DROP VIEW IF EXISTS fence_contacts_with_last_contact;
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

-- Update existing contacts with areas based on their current data
-- (Triangle area contacts from original import)
UPDATE fence_contacts SET area = 'Triangle Area' WHERE area IS NULL;

-- ============================================================
-- IMPORT NEW CONTACTS FROM EXPANDED SPREADSHEET
-- ============================================================

-- Franklin County / Louisburg
INSERT INTO fence_contacts (name, business_name, category, area, main_phone, email, address, notes, status) VALUES
('Julie Breedlove', 'Premier Sotheby''s International Realty (Breedlove Farms Estates & Land)', 'realtor', 'Franklin County / Louisburg', NULL, NULL, 'NC & SC statewide, including Franklin County', '35+ years equestrian experience, $372M+ in farm/equestrian sales - premier specialist worth a statewide relationship', 'prospect'),
('Town & Country Equine & Pet Hospital', 'Town & Country Equine & Pet Hospital', 'veterinarian', 'Franklin County / Louisburg', '919-497-9366', NULL, 'Louisburg, Franklin County', 'Started as a dedicated equine/livestock practice, expanded in 2014 to small animals too', 'prospect'),
('Marks Farrier Service', 'Marks Farrier Service', 'farrier', 'Franklin County / Louisburg', NULL, NULL, 'Louisburg, Franklin County', 'Listed in multiple regional equine directories serving Franklin County', 'prospect'),
('Murphy Farm Hay & Feed', 'Murphy Farm Hay & Feed', 'feed_store', 'Franklin County / Louisburg', '919-496-4646', NULL, 'Louisburg, Franklin County (also serves Henderson, Wake Forest)', '30+ years serving area farms; horse feed, hay, fertilizer, grass seed', 'prospect'),
('Tractor Supply Co. - Louisburg', 'Tractor Supply Co.', 'feed_store', 'Franklin County / Louisburg', '919-497-0190', NULL, 'Louisburg, Franklin County', 'Carries fencing, gates, and livestock supplies; high rural foot traffic', 'prospect'),
('Martha Mobley', 'NC Cooperative Extension - Franklin County Center', 'extension', 'Franklin County / Louisburg', '919-496-3344', 'martha_mobley@ncsu.edu', 'Franklin County', 'Covers beef, horse, goat, sheep, poultry, and forage AND is the 4-H Livestock Program Coordinator - single best contact in the county', 'prospect'),
('Franklin County Cattlemen''s Association', 'Facebook Group', 'community_group', 'Franklin County / Louisburg', NULL, NULL, 'Franklin County', 'Active Facebook group of local cattle producers - good source of fencing referral requests', 'prospect'),
('Franklin County Fairgrounds / 4-H Livestock Show', 'Franklin County Fairgrounds (fcfair.org)', 'other', 'Franklin County / Louisburg', NULL, NULL, 'Franklin County (Louisburg)', 'Hosts Junior Fair and annual 4-H Livestock Fun Show - sponsorship/booth opportunity to reach many small farm owners at once', 'prospect'),
('Hunt Family Vineyards', 'Hunt Family Vineyards', 'other', 'Franklin County / Louisburg', '919-510-8464', 'Weddings@huntfamilyvineyards.com', 'Louisburg, Franklin County', '180-acre vineyard, 100 acres in muscadine grapes - one of the largest muscadine vineyards in the Southeast; deer pressure on a planting this size is a strong fencing lead', 'prospect'),
('Tempest Cellars', 'Tempest Cellars', 'other', 'Franklin County / Louisburg', NULL, NULL, 'Franklin County', 'Small family-owned farm winery and tasting room in Franklin County', 'prospect'),
('South Louisburg Solar / Sarah Solar', 'Solar Farm (operator TBD)', 'other', 'Franklin County / Louisburg', NULL, NULL, 'Louisburg, Franklin County', 'Two operating solar arrays near Louisburg (5MW South Louisburg Solar; Sarah Solar on Brewer Rd) - worth reaching out directly to ask about vegetation-grazing and perimeter fencing needs', 'prospect'),
('Franklin County Animal Shelter', 'Franklin County Animal Shelter', 'other', 'Franklin County / Louisburg', '919-496-3032', NULL, 'Louisburg, Franklin County', 'County-run shelter; good referral partner for surrendered livestock/large-animal cases', 'prospect'),
('Louisburg Tractor', 'Louisburg Tractor (Kubota Dealer)', 'other', 'Franklin County / Louisburg', '919-496-3594', NULL, 'Louisburg, Franklin County', 'Locally owned since 1951; Kubota, Scag, Bush Hog, Echo dealer - customers buying equipment for new land often need fencing too', 'prospect');

-- Sanford / Lee County
INSERT INTO fence_contacts (name, business_name, category, area, main_phone, email, address, notes, status) VALUES
('Foundation Equine Clinic', 'Foundation Equine Clinic', 'veterinarian', 'Sanford / Lee County', NULL, NULL, 'Southern Pines-based; covers Sanford, Vass, Aberdeen, Raeford', 'Area''s only board-certified equine veterinary specialist', 'prospect'),
('3H Veterinary Service', '3H Veterinary Service', 'veterinarian', 'Sanford / Lee County', NULL, NULL, 'Sanford, Lee County', 'Local large-animal vet option serving the Sanford area', 'prospect'),
('Carolina Town & Country', 'Carolina Town & Country', 'feed_store', 'Sanford / Lee County', '919-776-2790', NULL, 'Sanford, Lee County', 'Family-run feed & farm supply store, also sells goats/chickens/ducks - direct line to new small-farm owners', 'prospect'),
('Tractor Supply Co. - Sanford', 'Tractor Supply Co.', 'feed_store', 'Sanford / Lee County', '919-708-9057', NULL, 'Sanford, Lee County', 'Carries fencing, gates, and livestock supplies', 'prospect'),
('Jared Butler', 'NC Cooperative Extension - Lee County Center', 'extension', 'Sanford / Lee County', '919-775-5624', 'jsbutle3@ncsu.edu', 'Lee County', 'Directly assists livestock producers with field/production issues; also does pond and pesticide education', 'prospect'),
('Lee County Cattlemen''s Association', 'Lee County Cattlemen''s Association', 'community_group', 'Sanford / Lee County', NULL, NULL, 'Lee County (meets at McSwain Center, Sanford)', 'Six educational meetings Oct-May, active since the mid-1960s - well-established group of cattle producers', 'prospect'),
('Lee Regional Fair', 'Lee Regional Fair / Sanford Lions Club', 'other', 'Sanford / Lee County', '919-292-0160', NULL, 'Lee County (Sanford)', 'Annual ag fair with cattle, goat, and poultry livestock contests - sponsorship/booth opportunity', 'prospect'),
('Lee County 4-H', 'NC Cooperative Extension - Lee County 4-H', 'extension', 'Sanford / Lee County', '919-775-5624', NULL, 'Lee County', 'Youth livestock project families often building or upgrading fencing for project animals', 'prospect'),
('Gross Farms LLC', 'Gross Farms LLC', 'other', 'Sanford / Lee County', '919-498-6727', 'info@grossfarms.com', 'Sanford, Lee County', 'U-pick peaches and produce 4 miles south of Sanford - deer exclusion fencing prospect for orchard rows', 'prospect'),
('Healing Acres Horse Farm', 'Healing Acres Horse Farm Inc.', 'other', 'Sanford / Lee County', NULL, 'healingacresranch@gmail.com', 'Sanford, Lee County', 'Equine-assisted healing nonprofit based in Sanford - needs safe, secure fencing for therapy horses and visiting clients', 'prospect'),
('Carolina Animal Rescue & Adoption (CARA)', 'Carolina Animal Rescue & Adoption', 'other', 'Sanford / Lee County', '929-774-9433', 'cara@cara-nc.org', 'Sanford, Lee County', 'No-kill 501(c)(3) shelter serving Lee County', 'prospect'),
('Central Carolina Power Equipment', 'Central Carolina Power Equipment', 'other', 'Sanford / Lee County', '919-292-6464', NULL, 'Sanford, Lee County', 'Kubota dealer matching equipment to farm needs - good cross-referral partner', 'prospect'),
('The Fields Equestrian Community', 'The Fields Equestrian Community', 'hoa', 'Sanford / Lee County', NULL, NULL, 'Cameron, NC (Moore/Lee County border area)', 'Ranked the #1 equestrian community in NC - dense concentration of horse properties needing fencing', 'prospect');

-- Fayetteville / Cumberland County
INSERT INTO fence_contacts (name, business_name, category, area, main_phone, email, address, notes, status) VALUES
('Brian K. Garrett DVM', 'Independent Practice', 'veterinarian', 'Fayetteville / Cumberland County', NULL, NULL, 'Fayetteville, Cumberland County', 'Dedicated equine vet based on Fort Bragg Rd', 'prospect'),
('North Star Veterinary Hospital', 'North Star Veterinary Hospital', 'veterinarian', 'Fayetteville / Cumberland County', NULL, NULL, 'Fayetteville; covers Cumberland, Robeson, Hoke counties', '30+ years equine experience; scheduled farm-call days each week', 'prospect'),
('Peak Performance Mobile Veterinarian', 'Peak Performance Mobile Veterinarian', 'veterinarian', 'Fayetteville / Cumberland County', NULL, NULL, 'Sanford-Fayetteville-Raeford-Vass-Cameron-Lillington-Hope Mills-Carthage', 'Wide mobile service radius covering both the Sanford and Fayetteville areas - efficient single contact for both regions', 'prospect'),
('Double LL Tack & Feed', 'Double LL Tack & Feed', 'feed_store', 'Fayetteville / Cumberland County', NULL, NULL, 'Coats, NC - serves Fayetteville/Cumberland and Lee/Harnett counties', 'Family owned since 1980; extensive tack, feed, and farrier supply inventory', 'prospect'),
('Family Farm Store', 'Family Farm Store', 'feed_store', 'Fayetteville / Cumberland County', '910-483-6309', NULL, 'Fayetteville, Cumberland County', 'Local feed store with multiple Fayetteville-area locations', 'prospect'),
('Kenny Bailey', 'NC Cooperative Extension - Cumberland County Center', 'extension', 'Fayetteville / Cumberland County', '910-321-6871', 'kenneth_bailey@ncsu.edu', 'Cumberland County', 'Main point of contact for Cumberland County ag/livestock producers', 'prospect'),
('Cumberland County Livestock Association', 'Facebook Group', 'community_group', 'Fayetteville / Cumberland County', NULL, NULL, 'Cumberland County (Fayetteville)', 'Active local livestock owner community group', 'prospect'),
('Cumberland County Fair', 'Cumberland County Fair (Crown Complex)', 'other', 'Fayetteville / Cumberland County', NULL, NULL, 'Cumberland County (Fayetteville)', 'Annual fair with cattle, hog, sheep ("Little Ewe Show"), feeder calf, and steer shows plus 4-H/FFA Day - strong sponsorship/booth opportunity', 'prospect'),
('Auman Vineyards', 'Auman Vineyards', 'other', 'Fayetteville / Cumberland County', '910-867-9689', 'tarheelroger@aol.com', 'Fayetteville, Cumberland County', 'Growing muscadines/scuppernongs organically since 2000; u-pick operation - deer exclusion fencing prospect', 'prospect'),
('Solar/Agrivoltaic Grazing - Cumberland County', NULL, 'other', 'Fayetteville / Cumberland County', NULL, NULL, 'Cumberland County / Fort Liberty area', 'No dedicated solar-grazing operation confirmed in Cumberland County yet - worth monitoring as regional solar development near Fort Liberty (Fort Bragg) expands; revisit in 6-12 months', 'prospect'),
('Fayetteville Animal Protection Society (FAPS)', 'Fayetteville Animal Protection Society', 'other', 'Fayetteville / Cumberland County', '910-864-9040', 'info@fapspet.org', 'Fayetteville, Cumberland County', 'Only licensed no-kill shelter in Cumberland County', 'prospect'),
('Second Chance Ranch Rescue and Sanctuary', 'Second Chance Ranch Rescue and Sanctuary', 'other', 'Fayetteville / Cumberland County', NULL, 'secondchanceranchnc@gmail.com', 'Raeford, Hoke County (borders Cumberland/Fayetteville)', 'Farm animal rescue/sanctuary just outside Fayetteville', 'prospect'),
('Therapeutic Riding - Cumberland County', NULL, 'other', 'Fayetteville / Cumberland County', NULL, NULL, 'Cumberland County / Fayetteville', 'No PATH-certified therapeutic riding center confirmed within Cumberland County; nearest options are in High Point and the Triangle - worth a follow-up search or ask local vets for referrals', 'prospect'),
('Cumberland Tractor Kubota of Fayetteville', 'Cumberland Tractor Kubota of Fayetteville (Linder Industrial Machinery)', 'other', 'Fayetteville / Cumberland County', '910-483-3892', NULL, 'Fayetteville, Cumberland County', '24,000 sq ft facility on 10 acres; sales, parts, and service', 'prospect');
