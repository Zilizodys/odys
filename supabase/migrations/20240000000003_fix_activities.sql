-- Supprime la table activities si elle existe
DROP TABLE IF EXISTS activities CASCADE;

-- Recrée la table activities avec la bonne structure
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    address TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Crée une politique RLS pour permettre la lecture à tous les utilisateurs authentifiés et anonymes
DROP POLICY IF EXISTS "Allow read access for all users" ON activities;
CREATE POLICY "Allow read access for all users"
    ON activities
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Crée une politique RLS pour permettre l'insertion par le rôle service_role
DROP POLICY IF EXISTS "Allow insert for service role" ON activities;
CREATE POLICY "Allow insert for service role"
    ON activities
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Crée un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insère les données
INSERT INTO activities (title, description, price, address, imageUrl, category, city) VALUES
    ('Musée du Louvre', 'Le plus grand musée d''art et d''antiquités au monde, abritant des chefs-d''œuvre comme la Joconde.', 17, 'Rue de Rivoli, 75001 Paris', 'https://images.unsplash.com/photo-1585129777188-9934d2f6c72f', 'Culture', 'Paris'),
    ('Dîner sur la Seine', 'Croisière romantique avec dîner sur la Seine, vue panoramique sur Paris illuminé.', 89, 'Port de la Conférence, 75008 Paris', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b', 'Romantique', 'Paris'),
    ('Escalade à Fontainebleau', 'Journée d''escalade dans les célèbres rochers de Fontainebleau.', 45, 'Forêt de Fontainebleau, 77300 Fontainebleau', 'https://images.unsplash.com/photo-1522163182402-834f871fd851', 'Aventure', 'Paris'),
    ('Rex Club', 'Club emblématique de la scène électro parisienne.', 20, '5 Boulevard Poissonnière, 75002 Paris', 'https://images.unsplash.com/photo-1571266028243-e4733b0f3295', 'Vie nocturne', 'Paris'),
    ('Spa Nuxe', 'Moment de détente dans un spa luxueux au cœur de Paris.', 120, '32 Rue Montorgueil, 75001 Paris', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874', 'Détente', 'Paris'),
    ('Musée d''Orsay', 'Musée d''art installé dans une ancienne gare, célèbre pour sa collection d''art impressionniste.', 16, '1 Rue de la Légion d''Honneur, 75007 Paris', 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8', 'Culture', 'Paris'),
    ('Jardin des Tuileries', 'Balade romantique dans l''un des plus beaux jardins de Paris.', 0, 'Place de la Concorde, 75001 Paris', 'https://images.unsplash.com/photo-1524396309943-e03f5249f002', 'Romantique', 'Paris'),
    ('Accrobranche Paris Bois', 'Parcours aventure dans les arbres au cœur du Bois de Vincennes.', 25, 'Route de la Pyramide, 75012 Paris', 'https://images.unsplash.com/photo-1562151272-8f97ce3e3446', 'Aventure', 'Paris');

-- Donne les permissions nécessaires
GRANT ALL ON activities TO postgres;
GRANT SELECT ON activities TO anon;
GRANT SELECT ON activities TO authenticated;
GRANT ALL ON activities TO service_role; 