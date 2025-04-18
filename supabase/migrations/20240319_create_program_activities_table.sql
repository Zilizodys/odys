-- Create program_activities table
CREATE TABLE program_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE program_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own program activities"
  ON program_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_activities.program_id
      AND programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own program activities"
  ON program_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_activities.program_id
      AND programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own program activities"
  ON program_activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_activities.program_id
      AND programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own program activities"
  ON program_activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_activities.program_id
      AND programs.user_id = auth.uid()
    )
  ); 