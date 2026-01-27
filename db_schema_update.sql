-- 1. Update Events Table
-- Add new fields for event types and status
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('fight_night', 'tournament')),
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'live', 'completed', 'cancelled')),
ADD COLUMN IF NOT EXISTS sport text, -- 'MMA', 'Muay Thai', 'Boxing'
ADD COLUMN IF NOT EXISTS level text; -- 'Amateur', 'Professional'

-- 2. Create Tournament Categories Table
-- Used for Tournament registration (instead of matches)
CREATE TABLE IF NOT EXISTS tournament_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  gender text NOT NULL, -- 'Male', 'Female'
  weight_class text NOT NULL, -- e.g. '70kg' or 'Lightweight'
  sport text, -- Optional override if category differs from event
  level text, -- Optional override
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Update Event Applications Table
-- Allow applying to EITHER a Match (Fight Night) OR a Category (Tournament)
ALTER TABLE event_applications 
ALTER COLUMN match_id DROP NOT NULL;

ALTER TABLE event_applications
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES tournament_categories(id) ON DELETE CASCADE;

-- Add constraint to ensure application is valid for at least one target
ALTER TABLE event_applications
ADD CONSTRAINT application_target_check 
CHECK (
  (match_id IS NOT NULL AND category_id IS NULL) OR 
  (match_id IS NULL AND category_id IS NOT NULL)
);

-- 4. Enable RLS on new table (Standard practice)
ALTER TABLE tournament_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public categories are viewable by everyone" 
ON tournament_categories FOR SELECT USING (true);

-- Allow organizers to insert/update their own categories
CREATE POLICY "Organizers can insert categories for their events" 
ON tournament_categories FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tournament_categories.event_id 
    AND events.organizer_id = auth.uid()
  )
);

CREATE POLICY "Organizers can update categories for their events" 
ON tournament_categories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tournament_categories.event_id 
    AND events.organizer_id = auth.uid()
  )
);

CREATE POLICY "Organizers can delete categories for their events" 
ON tournament_categories FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = tournament_categories.event_id 
    AND events.organizer_id = auth.uid()
  )
);
