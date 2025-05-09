-- Supprimer la table program_activities si elle existe
DROP TABLE IF EXISTS program_activities CASCADE;

-- Recréer la table program_activities avec les bonnes relations
CREATE TABLE program_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Activer RLS
ALTER TABLE program_activities ENABLE ROW LEVEL SECURITY;

-- Créer les politiques
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

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_program_activities_program_id ON program_activities(program_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_activity_id ON program_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_order_index ON program_activities(order_index); 