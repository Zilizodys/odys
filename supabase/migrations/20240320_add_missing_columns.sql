-- Ajouter les colonnes manquantes à la table programs
ALTER TABLE programs
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS imageUrl TEXT,
ADD COLUMN IF NOT EXISTS coverImage TEXT,
ADD COLUMN IF NOT EXISTS moods TEXT[] DEFAULT '{}'::text[] NOT NULL;

-- Mettre à jour les titres existants
UPDATE programs
SET title = CONCAT('Séjour à ', destination)
WHERE title IS NULL;

-- Ajouter la colonne imageurl à la table activities
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS imageurl TEXT;

-- Mettre à jour les valeurs existantes
UPDATE activities
SET imageurl = CONCAT('/images/activities/', id, '.jpg')
WHERE imageurl IS NULL; 