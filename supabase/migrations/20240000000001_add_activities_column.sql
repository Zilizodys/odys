-- Supprimer les anciennes colonnes
ALTER TABLE programs DROP COLUMN IF EXISTS activity_titles;
ALTER TABLE programs DROP COLUMN IF EXISTS activity_prices;

-- Ajouter la nouvelle colonne activities
ALTER TABLE programs ADD COLUMN activities JSONB DEFAULT '[]'::jsonb NOT NULL; 