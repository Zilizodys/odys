-- Supprimer les tables existantes dans le bon ordre
DROP TABLE IF EXISTS program_activities CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS programs CASCADE;

-- Recréer la table programs
CREATE TABLE programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    destination TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget INTEGER,
    companion TEXT,
    coverImage TEXT,
    moods TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Recréer la table activities
CREATE TABLE activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    address TEXT,
    imageurl TEXT,
    category TEXT,
    city TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Recréer la table program_activities avec les bonnes relations
CREATE TABLE program_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Activer RLS sur toutes les tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_activities ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité pour programs
CREATE POLICY "Les programmes sont visibles par leur propriétaire"
    ON programs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres programmes"
    ON programs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres programmes"
    ON programs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres programmes"
    ON programs FOR DELETE
    USING (auth.uid() = user_id);

-- Créer les politiques de sécurité pour activities
CREATE POLICY "Les activités sont visibles par tous"
    ON activities FOR SELECT
    USING (true);

CREATE POLICY "Les utilisateurs peuvent créer des activités"
    ON activities FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Les utilisateurs peuvent modifier des activités"
    ON activities FOR UPDATE
    USING (true);

CREATE POLICY "Les utilisateurs peuvent supprimer des activités"
    ON activities FOR DELETE
    USING (true);

-- Créer les politiques de sécurité pour program_activities
CREATE POLICY "Les activités de programme sont visibles par le propriétaire du programme"
    ON program_activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities.program_id
            AND programs.user_id = auth.uid()
        )
    );

CREATE POLICY "Les utilisateurs peuvent ajouter des activités à leurs programmes"
    ON program_activities FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities.program_id
            AND programs.user_id = auth.uid()
        )
    );

CREATE POLICY "Les utilisateurs peuvent modifier les activités de leurs programmes"
    ON program_activities FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities.program_id
            AND programs.user_id = auth.uid()
        )
    );

CREATE POLICY "Les utilisateurs peuvent supprimer les activités de leurs programmes"
    ON program_activities FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities.program_id
            AND programs.user_id = auth.uid()
        )
    );

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_programs_user_id ON programs(user_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_program_id ON program_activities(program_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_activity_id ON program_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_program_activities_order_index ON program_activities(order_index);

-- Donner les permissions nécessaires
GRANT ALL ON programs TO postgres;
GRANT SELECT ON programs TO anon;
GRANT SELECT ON programs TO authenticated;
GRANT ALL ON programs TO service_role;

GRANT ALL ON activities TO postgres;
GRANT SELECT ON activities TO anon;
GRANT SELECT ON activities TO authenticated;
GRANT ALL ON activities TO service_role;

GRANT ALL ON program_activities TO postgres;
GRANT SELECT ON program_activities TO anon;
GRANT SELECT ON program_activities TO authenticated;
GRANT ALL ON program_activities TO service_role; 