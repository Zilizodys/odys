-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  travel_preferences jsonb DEFAULT '{
    "preferredDestinations": [],
    "averageBudget": 1000,
    "travelStyle": [],
    "interests": []
  }',
  notification_preferences jsonb DEFAULT '{
    "emailNotifications": true,
    "pushNotifications": true,
    "marketingEmails": false
  }',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_created_at ON public.user_preferences(created_at);
CREATE INDEX IF NOT EXISTS idx_user_preferences_travel_preferences ON public.user_preferences USING gin(travel_preferences);
CREATE INDEX IF NOT EXISTS idx_user_preferences_notification_preferences ON public.user_preferences USING gin(notification_preferences);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle updates
CREATE OR REPLACE FUNCTION public.handle_user_preferences_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling updates
CREATE TRIGGER user_preferences_handle_update
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_preferences_update();

-- Create bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create policy for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Index pour les programmes
CREATE INDEX IF NOT EXISTS idx_programs_user_id ON public.programs(user_id);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON public.programs(created_at);
CREATE INDEX IF NOT EXISTS idx_programs_destination ON public.programs(destination);

-- Index pour les activités de programme
CREATE INDEX IF NOT EXISTS idx_program_activities_program_id ON public.program_activities(program_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_activity_id ON public.program_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_order_index ON public.program_activities(order_index);

-- Index pour les activités
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_city ON public.activities(city);
CREATE INDEX IF NOT EXISTS idx_activities_price ON public.activities(price); 