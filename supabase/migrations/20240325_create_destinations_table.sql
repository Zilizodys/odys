-- Créer la table destinations
CREATE TABLE IF NOT EXISTS destinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    city TEXT NOT NULL UNIQUE,
    country TEXT,
    imageurl TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Activer RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Les destinations sont visibles par tous"
    ON destinations FOR SELECT
    USING (true);

-- Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_destinations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_destinations_updated_at
    BEFORE UPDATE ON destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_destinations_updated_at(); 