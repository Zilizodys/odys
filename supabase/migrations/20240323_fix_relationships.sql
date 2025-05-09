-- Drop existing foreign key if it exists
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'program_activities_activity_id_fkey'
    ) THEN
        ALTER TABLE program_activities DROP CONSTRAINT program_activities_activity_id_fkey;
    END IF;
END $$;

-- Recreate the foreign key with explicit naming
ALTER TABLE program_activities
ADD CONSTRAINT program_activities_activity_id_fkey
FOREIGN KEY (activity_id)
REFERENCES activities(id)
ON DELETE CASCADE;

-- Create explicit relationship view
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