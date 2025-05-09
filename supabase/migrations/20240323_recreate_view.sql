-- Supprimer la vue et ses politiques existantes
DROP POLICY IF EXISTS "Les activités de programme sont visibles par le propriétaire du programme" ON program_activities_with_activities;
DROP VIEW IF EXISTS program_activities_with_activities;

-- Recréer la vue avec un nouveau nom temporaire
CREATE OR REPLACE VIEW program_activities_with_activities_new AS
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
GRANT SELECT ON program_activities_with_activities_new TO authenticated;
GRANT SELECT ON program_activities_with_activities_new TO anon;

-- Activer RLS
ALTER VIEW program_activities_with_activities_new ENABLE ROW LEVEL SECURITY;

-- Créer la politique
CREATE POLICY "Les activités de programme sont visibles par le propriétaire du programme"
    ON program_activities_with_activities_new FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM programs
            WHERE programs.id = program_activities_with_activities_new.program_id
            AND programs.user_id = auth.uid()
        )
    );

-- Renommer la vue
ALTER VIEW program_activities_with_activities_new RENAME TO program_activities_with_activities; 