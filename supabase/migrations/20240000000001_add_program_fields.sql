-- Ajouter les champs manquants à la table programs
ALTER TABLE programs
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS imageUrl TEXT,
ADD COLUMN IF NOT EXISTS coverImage TEXT,
ADD COLUMN IF NOT EXISTS moods TEXT[];

-- Mettre à jour les programmes existants avec un titre par défaut
UPDATE programs
SET title = 'Séjour à ' || destination
WHERE title IS NULL;

-- Ajouter une contrainte NOT NULL sur le titre
ALTER TABLE programs
ALTER COLUMN title SET NOT NULL; 