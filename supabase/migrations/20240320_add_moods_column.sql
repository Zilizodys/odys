-- Ajouter la colonne moods à la table programs
ALTER TABLE programs
ADD COLUMN IF NOT EXISTS moods TEXT[] DEFAULT '{}'::text[] NOT NULL; 