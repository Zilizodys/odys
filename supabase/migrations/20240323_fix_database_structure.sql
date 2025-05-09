-- Supprimer les contraintes existantes
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'program_activities_activity_id_fkey'
    ) THEN
        ALTER TABLE program_activities DROP CONSTRAINT program_activities_activity_id_fkey;
    END IF;
END $$;

-- Recréer les tables avec les bonnes relations
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    address TEXT,
    imageurl TEXT,
    category TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8)
);

CREATE TABLE IF NOT EXISTS programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget INTEGER,
    companion TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS program_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Créer une vue pour faciliter les requêtes
CREATE OR REPLACE VIEW program_activities_with_activities AS
SELECT 
    pa.*,
    a.title as activity_title,
    a.description as activity_description,
    a.price as activity_price,
    a.address as activity_address,
    a.imageurl as activity_imageurl,
    a.category as activity_category,
    a.city as activity_city
FROM program_activities pa
JOIN activities a ON pa.activity_id = a.id;

-- Activer RLS sur les tables
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_activities ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Les activités sont visibles par tous"
    ON activities FOR SELECT
    USING (true);

CREATE POLICY "Les programmes sont visibles par leur propriétaire"
    ON programs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Les activités de programme sont visibles par le propriétaire du programme"
    ON program_activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities.program_id
            AND programs.user_id = auth.uid()
        )
    ); 