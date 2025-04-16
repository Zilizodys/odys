-- Supprimer d'abord les politiques existantes
DROP POLICY IF EXISTS "Users can view their own programs" ON programs;
DROP POLICY IF EXISTS "Users can create their own programs" ON programs;
DROP POLICY IF EXISTS "Users can update their own programs" ON programs;
DROP POLICY IF EXISTS "Users can delete their own programs" ON programs;

-- Supprimer la table si elle existe
DROP TABLE IF EXISTS programs;

-- Créer la table programs
CREATE TABLE programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT,
    start_date DATE,
    end_date DATE,
    budget INTEGER,
    companion TEXT,
    activity_titles TEXT,
    activity_prices TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Users can view their own programs"
ON programs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own programs"
ON programs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own programs"
ON programs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own programs"
ON programs FOR DELETE
USING (auth.uid() = user_id);

-- Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 