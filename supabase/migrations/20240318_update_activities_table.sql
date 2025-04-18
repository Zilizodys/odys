-- Add program_id to activities table
ALTER TABLE public.activities
ADD COLUMN program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE;

-- Enable RLS on activities table
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Users can view activities of their programs" ON public.activities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.programs
      WHERE programs.id = activities.program_id
      AND programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update activities of their programs" ON public.activities
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.programs
      WHERE programs.id = activities.program_id
      AND programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete activities of their programs" ON public.activities
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.programs
      WHERE programs.id = activities.program_id
      AND programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activities in their programs" ON public.activities
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.programs
      WHERE programs.id = activities.program_id
      AND programs.user_id = auth.uid()
    )
  ); 