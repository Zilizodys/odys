-- Ajouter la colonne price_range
ALTER TABLE activities ADD COLUMN price_range TEXT;

-- Mettre à jour les activités existantes avec leur gamme de prix
UPDATE activities 
SET price_range = CASE 
    WHEN price = 0 THEN 'gratuit'
    WHEN price <= 15 THEN 'budget'
    WHEN price <= 50 THEN 'moyen'
    WHEN price <= 100 THEN 'premium'
    ELSE 'luxe'
END; 