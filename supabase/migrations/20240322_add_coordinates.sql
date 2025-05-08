-- Ajouter les colonnes lat et lng à la table activities
ALTER TABLE activities
ADD COLUMN lat DOUBLE PRECISION,
ADD COLUMN lng DOUBLE PRECISION;

-- Mettre à jour les coordonnées pour les activités existantes
UPDATE activities
SET 
  lat = CASE 
    WHEN city = 'paris' THEN 48.8566
    WHEN city = 'lyon' THEN 45.7578
    WHEN city = 'marseille' THEN 43.2965
    WHEN city = 'rome' THEN 41.9028
    WHEN city = 'berlin' THEN 52.5200
    WHEN city = 'bruxelles' THEN 50.8503
    ELSE NULL
  END,
  lng = CASE 
    WHEN city = 'paris' THEN 2.3522
    WHEN city = 'lyon' THEN 4.8320
    WHEN city = 'marseille' THEN 5.3698
    WHEN city = 'rome' THEN 12.4964
    WHEN city = 'berlin' THEN 13.4050
    WHEN city = 'bruxelles' THEN 4.3517
    ELSE NULL
  END; 