-- Supprimer la vue si elle existe
DROP VIEW IF EXISTS program_activities_with_activities;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Les activités de programme sont visibles par le propriétaire du programme" ON program_activities_with_activities;

-- Recréer la vue
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

-- Donner les permissions nécessaires
GRANT SELECT ON program_activities_with_activities TO authenticated;
GRANT SELECT ON program_activities_with_activities TO anon;

-- Exposer la vue via l'API REST
ALTER VIEW program_activities_with_activities ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour la vue
CREATE POLICY "Les activités de programme sont visibles par le propriétaire du programme"
    ON program_activities_with_activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities_with_activities.program_id
            AND programs.user_id = auth.uid()
        )
    );

-- Activer l'accès REST pour la vue
ALTER VIEW program_activities_with_activities SET SCHEMA public; 