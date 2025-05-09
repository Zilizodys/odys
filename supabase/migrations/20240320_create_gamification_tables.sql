-- Create points table
CREATE TABLE IF NOT EXISTS public.user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_url text NOT NULL,
  points_required integer NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE,
  achieved_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user_points
CREATE POLICY "Users can view their own points"
  ON public.user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
  ON public.user_points FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for badges
CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle points updates
CREATE OR REPLACE FUNCTION public.handle_points_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for points updates
CREATE TRIGGER user_points_handle_update
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_points_update();

-- Insert some initial badges
INSERT INTO public.badges (name, description, icon_url, points_required, category) VALUES
  ('Premier Voyage', 'Créez votre premier programme de voyage', '/badges/first-trip.svg', 100, 'program'),
  ('Explorateur', 'Complétez 5 programmes de voyage', '/badges/explorer.svg', 500, 'program'),
  ('Aventurier', 'Complétez 10 programmes de voyage', '/badges/adventurer.svg', 1000, 'program'),
  ('Voyageur Solo', 'Créez un programme en solo', '/badges/solo-traveler.svg', 200, 'program'),
  ('Gourmet', 'Ajoutez 5 activités gastronomiques', '/badges/foodie.svg', 300, 'activity'),
  ('Culturel', 'Ajoutez 5 activités culturelles', '/badges/cultural.svg', 300, 'activity'),
  ('Sportif', 'Ajoutez 5 activités sportives', '/badges/sporty.svg', 300, 'activity'),
  ('Noctambule', 'Ajoutez 5 activités nocturnes', '/badges/night-owl.svg', 300, 'activity'),
  ('Nature', 'Ajoutez 5 activités en plein air', '/badges/nature.svg', 300, 'activity');

-- Create indexes
CREATE INDEX idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_badge_id ON public.user_achievements(badge_id);
CREATE INDEX idx_badges_category ON public.badges(category); 