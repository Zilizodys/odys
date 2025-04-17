-- Ajoute la colonne price_range si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'price_range'
    ) THEN
        ALTER TABLE activities ADD COLUMN price_range VARCHAR(20);
    END IF;
END $$;

-- Supprime toutes les données existantes
DELETE FROM activities;

-- Insère les activités pour Paris
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
-- Culture Paris - Gratuit
('Musée Carnavalet', 'Histoire de Paris à travers les siècles', 0, '23 Rue de Sévigné, 75003 Paris', '/images/activities/carnavalet.jpg', 'culture', 'paris', 'gratuit'),
('Jardin des Tuileries', 'Jardin à la française entre le Louvre et la Concorde', 0, 'Place de la Concorde, 75001 Paris', '/images/activities/tuileries.jpg', 'culture', 'paris', 'gratuit'),
('Église Saint-Sulpice', 'Église baroque avec fresques de Delacroix', 0, '2 Rue Palatine, 75006 Paris', '/images/activities/saint-sulpice.jpg', 'culture', 'paris', 'gratuit'),
('Bibliothèque Nationale', 'Bibliothèque historique de France', 0, '5 Rue Vivienne, 75002 Paris', '/images/activities/bnf.jpg', 'culture', 'paris', 'gratuit'),
('Cimetière du Père-Lachaise', 'Plus grand cimetière de Paris', 0, '16 Rue du Repos, 75020 Paris', '/images/activities/pere-lachaise.jpg', 'culture', 'paris', 'gratuit');

-- Culture Paris - Budget
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Musée de la Vie Romantique', 'Musée dédié au romantisme', 12, '16 Rue Chaptal, 75009 Paris', '/images/activities/vie-romantique.jpg', 'culture', 'paris', 'budget'),
('Musée de Montmartre', 'Histoire du quartier des artistes', 15, '12 Rue Cortot, 75018 Paris', '/images/activities/montmartre.jpg', 'culture', 'paris', 'budget'),
('Musée de la Chasse', 'Collection d''art et d''objets de chasse', 12, '62 Rue des Archives, 75003 Paris', '/images/activities/chasse.jpg', 'culture', 'paris', 'budget'),
('Musée Nissim de Camondo', 'Hôtel particulier art déco', 14, '63 Rue de Monceau, 75008 Paris', '/images/activities/camondo.jpg', 'culture', 'paris', 'budget'),
('Musée de la Musique', 'Collection d''instruments de musique', 15, '221 Avenue Jean-Jaurès, 75019 Paris', '/images/activities/musique.jpg', 'culture', 'paris', 'budget');

-- Culture Paris - Moyen
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Musée d''Orsay', 'Collection impressionniste dans une ancienne gare', 16, '1 Rue de la Légion d''Honneur, 75007 Paris', '/images/activities/orsay.jpg', 'culture', 'paris', 'moyen'),
('Centre Pompidou', 'Art moderne et contemporain', 14, 'Place Georges-Pompidou, 75004 Paris', '/images/activities/pompidou.jpg', 'culture', 'paris', 'moyen'),
('Musée de l''Orangerie', 'Les Nymphéas de Monet', 12, 'Jardin des Tuileries, 75001 Paris', '/images/activities/orangerie.jpg', 'culture', 'paris', 'moyen'),
('Musée Rodin', 'Sculptures dans un hôtel particulier', 13, '79 Rue de Varenne, 75007 Paris', '/images/activities/rodin.jpg', 'culture', 'paris', 'moyen'),
('Musée Picasso', 'Collection d''œuvres de Pablo Picasso', 14, '5 Rue de Thorigny, 75003 Paris', '/images/activities/picasso.jpg', 'culture', 'paris', 'moyen');

-- Culture Paris - Premium
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Musée du Louvre', 'Le plus grand musée d''art au monde', 17, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre.jpg', 'culture', 'paris', 'premium'),
('Palais de Versailles', 'Château et jardins du Roi Soleil', 27, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles.jpg', 'culture', 'paris', 'premium'),
('Opéra Garnier', 'Visite guidée du palais Garnier', 25, '8 Rue Scribe, 75009 Paris', '/images/activities/opera.jpg', 'culture', 'paris', 'premium'),
('Château de Fontainebleau', 'Résidence royale historique', 15, '77300 Fontainebleau', '/images/activities/fontainebleau.jpg', 'culture', 'paris', 'premium'),
('Musée des Arts Décoratifs', 'Art décoratif et design', 14, '107 Rue de Rivoli, 75001 Paris', '/images/activities/arts-deco.jpg', 'culture', 'paris', 'premium');

-- Culture Paris - Luxe
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Visite Privée du Louvre', 'Visite exclusive du musée', 200, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre-prive.jpg', 'culture', 'paris', 'luxe'),
('Soirée à Versailles', 'Dîner et visite privée', 300, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles-soiree.jpg', 'culture', 'paris', 'luxe'),
('Vol en Hélicoptère', 'Survol des châteaux d''Île-de-France', 400, 'Héliport de Paris, 75015 Paris', '/images/activities/helico-culture.jpg', 'culture', 'paris', 'luxe'),
('Opéra VIP', 'Soirée privée à l''Opéra Garnier', 500, '8 Rue Scribe, 75009 Paris', '/images/activities/opera-vip.jpg', 'culture', 'paris', 'luxe'),
('Week-end Culturel', 'Expérience culturelle exclusive', 1000, 'Paris', '/images/activities/weekend-culture.jpg', 'culture', 'paris', 'luxe');

-- Gastronomie Paris - Gratuit
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Marché d''Aligre', 'Marché traditionnel parisien', 0, 'Place d''Aligre, 75012 Paris', '/images/activities/aligre.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché des Enfants Rouges', 'Plus vieux marché couvert de Paris', 0, '39 Rue de Bretagne, 75003 Paris', '/images/activities/enfants-rouges.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Bastille', 'Grand marché alimentaire', 0, 'Place de la Bastille, 75011 Paris', '/images/activities/marche-bastille.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Mouffetard', 'Rue commerçante historique', 0, 'Rue Mouffetard, 75005 Paris', '/images/activities/mouffetard.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Saxe-Breteuil', 'Vue sur la Tour Eiffel', 0, 'Avenue de Saxe, 75007 Paris', '/images/activities/saxe-breteuil.jpg', 'gastronomie', 'paris', 'gratuit');

-- Gastronomie Paris - Budget
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('L''As du Fallafel', 'Meilleurs falafels de Paris', 8, '34 Rue des Rosiers, 75004 Paris', '/images/activities/fallafel.jpg', 'gastronomie', 'paris', 'budget'),
('Bouillon Chartier', 'Restaurant historique parisien', 15, '7 Rue du Faubourg Montmartre, 75009 Paris', '/images/activities/chartier.jpg', 'gastronomie', 'paris', 'budget'),
('Le Petit Vendôme', 'Sandwicherie traditionnelle', 10, '8 Rue des Capucines, 75002 Paris', '/images/activities/vendome.jpg', 'gastronomie', 'paris', 'budget'),
('L''Avant Comptoir', 'Bar à vins et tapas', 15, '3 Carrefour de l''Odéon, 75006 Paris', '/images/activities/avant-comptoir.jpg', 'gastronomie', 'paris', 'budget'),
('Le Baron Rouge', 'Bar à vin traditionnel', 12, '1 Rue Théophile Roussel, 75012 Paris', '/images/activities/baron-rouge.jpg', 'gastronomie', 'paris', 'budget');

-- Gastronomie Paris - Moyen
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Le Baratin', 'Bistrot gastronomique', 55, '3 Rue Jouye-Rouve, 75020 Paris', '/images/activities/baratin.jpg', 'gastronomie', 'paris', 'moyen'),
('Le Chateaubriand', 'Restaurant néo-bistrot', 95, '129 Avenue Parmentier, 75011 Paris', '/images/activities/chateaubriand.jpg', 'gastronomie', 'paris', 'moyen'),
('Le Comptoir du Relais', 'Bistrot gastronomique', 45, '9 Carrefour de l''Odéon, 75006 Paris', '/images/activities/comptoir.jpg', 'gastronomie', 'paris', 'moyen'),
('Bistrot Paul Bert', 'Cuisine française traditionnelle', 50, '18 Rue Paul Bert, 75011 Paris', '/images/activities/paul-bert.jpg', 'gastronomie', 'paris', 'moyen'),
('Clamato', 'Restaurant de fruits de mer', 60, '80 Rue de Charonne, 75011 Paris', '/images/activities/clamato.jpg', 'gastronomie', 'paris', 'moyen');

-- Gastronomie Paris - Premium
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('L''Arpège', 'Restaurant 3 étoiles Michelin', 175, '84 Rue de Varenne, 75007 Paris', '/images/activities/arpege.jpg', 'gastronomie', 'paris', 'premium'),
('Le Bristol', 'Restaurant gastronomique', 180, '112 Rue du Faubourg Saint-Honoré, 75008 Paris', '/images/activities/bristol.jpg', 'gastronomie', 'paris', 'premium'),
('L''Abeille', 'Restaurant 2 étoiles Michelin', 165, '10 Avenue d''Iéna, 75116 Paris', '/images/activities/abeille.jpg', 'gastronomie', 'paris', 'premium'),
('Le Cinq', 'Restaurant gastronomique', 195, '31 Avenue George V, 75008 Paris', '/images/activities/cinq.jpg', 'gastronomie', 'paris', 'premium'),
('Guy Savoy', 'Restaurant 3 étoiles Michelin', 170, 'Monnaie de Paris, 75006 Paris', '/images/activities/guy-savoy.jpg', 'gastronomie', 'paris', 'premium');

-- Gastronomie Paris - Luxe
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
('Dîner sur la Tour Eiffel', 'Expérience gastronomique unique', 300, 'Champ de Mars, 75007 Paris', '/images/activities/tour-eiffel-diner.jpg', 'gastronomie', 'paris', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Paris', '/images/activities/chef-domicile.jpg', 'gastronomie', 'paris', 'luxe'),
('Dîner Croisière VIP', 'Dîner gastronomique sur la Seine', 400, 'Port de la Conférence, 75008 Paris', '/images/activities/croisiere-vip.jpg', 'gastronomie', 'paris', 'luxe'),
('Cours de Cuisine Privé', 'Cours avec un chef étoilé', 350, 'Paris', '/images/activities/cours-cuisine.jpg', 'gastronomie', 'paris', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques parisiennes', 250, 'Paris', '/images/activities/degustation-luxe.jpg', 'gastronomie', 'paris', 'luxe'); 