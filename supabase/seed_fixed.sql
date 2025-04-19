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
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
-- Culture Paris - Gratuit
('Musée Carnavalet', 'Histoire de Paris à travers les siècles', 0, '23 Rue de Sévigné, 75003 Paris', '/images/activities/carnavalet.jpg', 'culture', 'paris', 'gratuit'),
('Jardin des Tuileries', 'Jardin à la française entre le Louvre et la Concorde', 0, 'Place de la Concorde, 75001 Paris', '/images/activities/tuileries.jpg', 'culture', 'paris', 'gratuit'),
('Église Saint-Sulpice', 'Église baroque avec fresques de Delacroix', 0, '2 Rue Palatine, 75006 Paris', '/images/activities/saint-sulpice.jpg', 'culture', 'paris', 'gratuit'),
('Bibliothèque Nationale', 'Bibliothèque historique de France', 0, '5 Rue Vivienne, 75002 Paris', '/images/activities/bnf.jpg', 'culture', 'paris', 'gratuit'),
('Cimetière du Père-Lachaise', 'Plus grand cimetière de Paris', 0, '16 Rue du Repos, 75020 Paris', '/images/activities/pere-lachaise.jpg', 'culture', 'paris', 'gratuit');

-- Culture Paris - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Musée de la Vie Romantique', 'Musée dédié au romantisme', 12, '16 Rue Chaptal, 75009 Paris', '/images/activities/vie-romantique.jpg', 'culture', 'paris', 'budget'),
('Musée de Montmartre', 'Histoire du quartier des artistes', 15, '12 Rue Cortot, 75018 Paris', '/images/activities/montmartre.jpg', 'culture', 'paris', 'budget'),
('Musée de la Chasse', 'Collection d''art et d''objets de chasse', 12, '62 Rue des Archives, 75003 Paris', '/images/activities/chasse.jpg', 'culture', 'paris', 'budget'),
('Musée Nissim de Camondo', 'Hôtel particulier art déco', 14, '63 Rue de Monceau, 75008 Paris', '/images/activities/camondo.jpg', 'culture', 'paris', 'budget'),
('Musée de la Musique', 'Collection d''instruments de musique', 15, '221 Avenue Jean-Jaurès, 75019 Paris', '/images/activities/musique.jpg', 'culture', 'paris', 'budget');

-- Culture Paris - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Musée d''Orsay', 'Collection impressionniste dans une ancienne gare', 16, '1 Rue de la Légion d''Honneur, 75007 Paris', '/images/activities/orsay.jpg', 'culture', 'paris', 'moyen'),
('Centre Pompidou', 'Art moderne et contemporain', 14, 'Place Georges-Pompidou, 75004 Paris', '/images/activities/pompidou.jpg', 'culture', 'paris', 'moyen'),
('Musée de l''Orangerie', 'Les Nymphéas de Monet', 12, 'Jardin des Tuileries, 75001 Paris', '/images/activities/orangerie.jpg', 'culture', 'paris', 'moyen'),
('Musée Rodin', 'Sculptures dans un hôtel particulier', 13, '79 Rue de Varenne, 75007 Paris', '/images/activities/rodin.jpg', 'culture', 'paris', 'moyen'),
('Musée Picasso', 'Collection d''œuvres de Pablo Picasso', 14, '5 Rue de Thorigny, 75003 Paris', '/images/activities/picasso.jpg', 'culture', 'paris', 'moyen');

-- Culture Paris - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Musée du Louvre', 'Le plus grand musée d''art au monde', 17, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre.jpg', 'culture', 'paris', 'premium'),
('Palais de Versailles', 'Château et jardins du Roi Soleil', 27, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles.jpg', 'culture', 'paris', 'premium'),
('Opéra Garnier', 'Visite guidée du palais Garnier', 25, '8 Rue Scribe, 75009 Paris', '/images/activities/opera.jpg', 'culture', 'paris', 'premium'),
('Château de Fontainebleau', 'Résidence royale historique', 15, '77300 Fontainebleau', '/images/activities/fontainebleau.jpg', 'culture', 'paris', 'premium'),
('Musée des Arts Décoratifs', 'Art décoratif et design', 14, '107 Rue de Rivoli, 75001 Paris', '/images/activities/arts-deco.jpg', 'culture', 'paris', 'premium');

-- Culture Paris - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Visite Privée du Louvre', 'Visite exclusive du musée', 200, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre-prive.jpg', 'culture', 'paris', 'luxe'),
('Soirée à Versailles', 'Dîner et visite privée', 300, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles-soiree.jpg', 'culture', 'paris', 'luxe'),
('Vol en Hélicoptère', 'Survol des châteaux d''Île-de-France', 400, 'Héliport de Paris, 75015 Paris', '/images/activities/helico-culture.jpg', 'culture', 'paris', 'luxe'),
('Opéra VIP', 'Soirée privée à l''Opéra Garnier', 500, '8 Rue Scribe, 75009 Paris', '/images/activities/opera-vip.jpg', 'culture', 'paris', 'luxe'),
('Week-end Culturel', 'Expérience culturelle exclusive', 1000, 'Paris', '/images/activities/weekend-culture.jpg', 'culture', 'paris', 'luxe');

-- Gastronomie Paris - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Marché d''Aligre', 'Marché traditionnel parisien', 0, 'Place d''Aligre, 75012 Paris', '/images/activities/aligre.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché des Enfants Rouges', 'Plus vieux marché couvert de Paris', 0, '39 Rue de Bretagne, 75003 Paris', '/images/activities/enfants-rouges.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Bastille', 'Grand marché alimentaire', 0, 'Place de la Bastille, 75011 Paris', '/images/activities/marche-bastille.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Mouffetard', 'Rue commerçante historique', 0, 'Rue Mouffetard, 75005 Paris', '/images/activities/mouffetard.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Saxe-Breteuil', 'Vue sur la Tour Eiffel', 0, 'Avenue de Saxe, 75007 Paris', '/images/activities/saxe-breteuil.jpg', 'gastronomie', 'paris', 'gratuit');

-- Gastronomie Paris - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('L''As du Fallafel', 'Meilleurs falafels de Paris', 8, '34 Rue des Rosiers, 75004 Paris', '/images/activities/fallafel.jpg', 'gastronomie', 'paris', 'budget'),
('Bouillon Chartier', 'Restaurant historique parisien', 15, '7 Rue du Faubourg Montmartre, 75009 Paris', '/images/activities/chartier.jpg', 'gastronomie', 'paris', 'budget'),
('Le Petit Vendôme', 'Sandwicherie traditionnelle', 10, '8 Rue des Capucines, 75002 Paris', '/images/activities/vendome.jpg', 'gastronomie', 'paris', 'budget'),
('L''Avant Comptoir', 'Bar à vins et tapas', 15, '3 Carrefour de l''Odéon, 75006 Paris', '/images/activities/avant-comptoir.jpg', 'gastronomie', 'paris', 'budget'),
('Le Baron Rouge', 'Bar à vin traditionnel', 12, '1 Rue Théophile Roussel, 75012 Paris', '/images/activities/baron-rouge.jpg', 'gastronomie', 'paris', 'budget');

-- Gastronomie Paris - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Baratin', 'Bistrot gastronomique', 55, '3 Rue Jouye-Rouve, 75020 Paris', '/images/activities/baratin.jpg', 'gastronomie', 'paris', 'moyen'),
('Le Chateaubriand', 'Restaurant néo-bistrot', 95, '129 Avenue Parmentier, 75011 Paris', '/images/activities/chateaubriand.jpg', 'gastronomie', 'paris', 'moyen'),
('Le Comptoir du Relais', 'Bistrot gastronomique', 45, '9 Carrefour de l''Odéon, 75006 Paris', '/images/activities/comptoir.jpg', 'gastronomie', 'paris', 'moyen'),
('Bistrot Paul Bert', 'Cuisine française traditionnelle', 50, '18 Rue Paul Bert, 75011 Paris', '/images/activities/paul-bert.jpg', 'gastronomie', 'paris', 'moyen'),
('Clamato', 'Restaurant de fruits de mer', 60, '80 Rue de Charonne, 75011 Paris', '/images/activities/clamato.jpg', 'gastronomie', 'paris', 'moyen');

-- Gastronomie Paris - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('L''Arpège', 'Restaurant 3 étoiles Michelin', 175, '84 Rue de Varenne, 75007 Paris', '/images/activities/arpege.jpg', 'gastronomie', 'paris', 'premium'),
('Le Bristol', 'Restaurant gastronomique', 180, '112 Rue du Faubourg Saint-Honoré, 75008 Paris', '/images/activities/bristol.jpg', 'gastronomie', 'paris', 'premium'),
('L''Abeille', 'Restaurant 2 étoiles Michelin', 165, '10 Avenue d''Iéna, 75116 Paris', '/images/activities/abeille.jpg', 'gastronomie', 'paris', 'premium'),
('Le Cinq', 'Restaurant gastronomique', 195, '31 Avenue George V, 75008 Paris', '/images/activities/cinq.jpg', 'gastronomie', 'paris', 'premium'),
('Guy Savoy', 'Restaurant 3 étoiles Michelin', 170, 'Monnaie de Paris, 75006 Paris', '/images/activities/guy-savoy.jpg', 'gastronomie', 'paris', 'premium');

-- Gastronomie Paris - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dîner sur la Tour Eiffel', 'Expérience gastronomique unique', 300, 'Champ de Mars, 75007 Paris', '/images/activities/tour-eiffel-diner.jpg', 'gastronomie', 'paris', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Paris', '/images/activities/chef-domicile.jpg', 'gastronomie', 'paris', 'luxe'),
('Dîner Croisière VIP', 'Dîner gastronomique sur la Seine', 400, 'Port de la Conférence, 75008 Paris', '/images/activities/croisiere-vip.jpg', 'gastronomie', 'paris', 'luxe'),
('Cours de Cuisine Privé', 'Cours avec un chef étoilé', 350, 'Paris', '/images/activities/cours-cuisine.jpg', 'gastronomie', 'paris', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques parisiennes', 250, 'Paris', '/images/activities/degustation-luxe.jpg', 'gastronomie', 'paris', 'luxe');

-- Culture Lyon - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Place Bellecour', 'Plus grande place piétonne d''Europe', 0, 'Place Bellecour, 69002 Lyon', '/images/activities/bellecour.jpg', 'culture', 'lyon', 'gratuit'),
('Traboules du Vieux Lyon', 'Passages historiques secrets', 0, 'Vieux Lyon, 69005 Lyon', '/images/activities/traboules.jpg', 'culture', 'lyon', 'gratuit'),
('Parc de la Tête d''Or', 'Plus grand parc urbain de France', 0, 'Boulevard de Stalingrad, 69006 Lyon', '/images/activities/tete-or.jpg', 'culture', 'lyon', 'gratuit'),
('Basilique de Fourvière', 'Église néo-byzantine', 0, '8 Place de Fourvière, 69005 Lyon', '/images/activities/fourviere.jpg', 'culture', 'lyon', 'gratuit'),
('Quais de Saône', 'Promenade historique', 0, 'Quais de Saône, 69005 Lyon', '/images/activities/quais-saone.jpg', 'culture', 'lyon', 'gratuit');

-- Culture Lyon - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Musée des Beaux-Arts', 'Collection d''art classique', 12, '20 Place des Terreaux, 69001 Lyon', '/images/activities/beaux-arts.jpg', 'culture', 'lyon', 'budget'),
('Musée des Confluences', 'Musée des sciences', 15, '86 Quai Perrache, 69002 Lyon', '/images/activities/confluences.jpg', 'culture', 'lyon', 'budget'),
('Musée Gadagne', 'Histoire de Lyon', 10, '1 Place du Petit Collège, 69005 Lyon', '/images/activities/gadagne.jpg', 'culture', 'lyon', 'budget'),
('Musée de l''Imprimerie', 'Histoire de l''imprimerie', 12, '13 Rue de la Poulaillerie, 69002 Lyon', '/images/activities/imprimerie.jpg', 'culture', 'lyon', 'budget'),
('Musée des Tissus', 'Art textile et mode', 14, '34 Rue de la Charité, 69002 Lyon', '/images/activities/tissus.jpg', 'culture', 'lyon', 'budget');

-- Culture Lyon - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Opéra de Lyon', 'Spectacle lyrique', 45, '1 Place de la Comédie, 69001 Lyon', '/images/activities/opera-lyon.jpg', 'culture', 'lyon', 'moyen'),
('Théâtre des Célestins', 'Théâtre historique', 35, '4 Rue Charles Dullin, 69002 Lyon', '/images/activities/celestins.jpg', 'culture', 'lyon', 'moyen'),
('Auditorium', 'Salle de concert', 40, 'Rue de Bonnel, 69003 Lyon', '/images/activities/auditorium.jpg', 'culture', 'lyon', 'moyen'),
('Maison de la Danse', 'Spectacle de danse', 30, '8 Avenue Jean Mermoz, 69008 Lyon', '/images/activities/maison-danse.jpg', 'culture', 'lyon', 'moyen'),
('Théâtre de la Croix-Rousse', 'Théâtre contemporain', 25, 'Place Joannès Ambre, 69004 Lyon', '/images/activities/croix-rousse.jpg', 'culture', 'lyon', 'moyen');

-- Culture Lyon - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Biennale de la Danse', 'Festival international', 60, 'Lyon', '/images/activities/biennale-danse.jpg', 'culture', 'lyon', 'premium'),
('Festival Lumière', 'Festival du cinéma', 50, 'Lyon', '/images/activities/festival-lumiere.jpg', 'culture', 'lyon', 'premium'),
('Nuits de Fourvière', 'Festival pluridisciplinaire', 55, '6 Rue de l''Antiquaille, 69005 Lyon', '/images/activities/nuits-fourviere.jpg', 'culture', 'lyon', 'premium'),
('Festival Jazz à Vienne', 'Festival de jazz', 45, 'Vienne', '/images/activities/jazz-vienne.jpg', 'culture', 'lyon', 'premium'),
('Festival Les Nuits Sonores', 'Festival de musique électronique', 65, 'Lyon', '/images/activities/nuits-sonores.jpg', 'culture', 'lyon', 'premium');

-- Culture Lyon - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Visite Privée de Fourvière', 'Accès exclusif à la basilique', 200, '8 Place de Fourvière, 69005 Lyon', '/images/activities/fourviere-prive.jpg', 'culture', 'lyon', 'luxe'),
('Dîner à l''Opéra', 'Expérience gastronomique et culturelle', 300, '1 Place de la Comédie, 69001 Lyon', '/images/activities/opera-diner.jpg', 'culture', 'lyon', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 500, 'Lyon', '/images/activities/weekend-lyon.jpg', 'culture', 'lyon', 'luxe'),
('Soirée Privée aux Célestins', 'Spectacle privé', 400, '4 Rue Charles Dullin, 69002 Lyon', '/images/activities/celestins-prive.jpg', 'culture', 'lyon', 'luxe'),
('Expérience Lumière Exclusive', 'Tour privé des installations', 350, 'Lyon', '/images/activities/lumiere-exclusive.jpg', 'culture', 'lyon', 'luxe');

-- Gastronomie Lyon - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Marché Saint-Antoine', 'Marché alimentaire traditionnel', 0, 'Quai Saint-Antoine, 69002 Lyon', '/images/activities/saint-antoine.jpg', 'gastronomie', 'lyon', 'gratuit'),
('Marché de la Croix-Rousse', 'Marché bio et artisanal', 0, 'Boulevard de la Croix-Rousse, 69004 Lyon', '/images/activities/croix-rousse-marche.jpg', 'gastronomie', 'lyon', 'gratuit'),
('Marché des Halles', 'Marché couvert historique', 0, '102 Cours Lafayette, 69003 Lyon', '/images/activities/halles.jpg', 'gastronomie', 'lyon', 'gratuit'),
('Marché de la Part-Dieu', 'Plus grand marché de Lyon', 0, 'Centre Commercial La Part-Dieu, 69003 Lyon', '/images/activities/part-dieu.jpg', 'gastronomie', 'lyon', 'gratuit'),
('Marché de Gerland', 'Marché de quartier', 0, 'Avenue Jean Jaurès, 69007 Lyon', '/images/activities/gerland.jpg', 'gastronomie', 'lyon', 'gratuit');

-- Gastronomie Lyon - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Bouchon des Filles', 'Bouchon lyonnais traditionnel', 15, '20 Rue Sergent Blandan, 69001 Lyon', '/images/activities/bouchon-filles.jpg', 'gastronomie', 'lyon', 'budget'),
('Le Garet', 'Restaurant de quartier', 12, '7 Rue du Garet, 69001 Lyon', '/images/activities/garet.jpg', 'gastronomie', 'lyon', 'budget'),
('Le Bistrot de Saint-Paul', 'Cuisine traditionnelle', 14, '1 Rue de la Monnaie, 69005 Lyon', '/images/activities/bistrot-saint-paul.jpg', 'gastronomie', 'lyon', 'budget'),
('Le Café des Fédérations', 'Bouchon lyonnais', 16, '8 Rue du Major Martin, 69001 Lyon', '/images/activities/cafe-federations.jpg', 'gastronomie', 'lyon', 'budget'),
('Le Bistrot de l''Opéra', 'Restaurant convivial', 13, '1 Place de la Comédie, 69001 Lyon', '/images/activities/bistrot-opera.jpg', 'gastronomie', 'lyon', 'budget');

-- Gastronomie Lyon - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Bistrot de l''Ecole', 'Cuisine bistronomique', 45, '23 Rue de la Baleine, 69005 Lyon', '/images/activities/bistrot-ecole.jpg', 'gastronomie', 'lyon', 'moyen'),
('Le Kitchen Café', 'Restaurant fusion', 50, '34 Rue de la République, 69002 Lyon', '/images/activities/kitchen-cafe.jpg', 'gastronomie', 'lyon', 'moyen'),
('Le Bistrot de la Plage', 'Cuisine méditerranéenne', 55, '3 Rue des Pierres Plantées, 69001 Lyon', '/images/activities/bistrot-plage.jpg', 'gastronomie', 'lyon', 'moyen'),
('Le Bistrot de la Tour', 'Cuisine du terroir', 48, '3 Rue de la Tour, 69005 Lyon', '/images/activities/bistrot-tour.jpg', 'gastronomie', 'lyon', 'moyen'),
('Le Bistrot de la Colline', 'Cuisine créative', 52, '12 Rue de la Colline, 69005 Lyon', '/images/activities/bistrot-colline.jpg', 'gastronomie', 'lyon', 'moyen');

-- Gastronomie Lyon - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('La Mère Brazier', 'Restaurant gastronomique', 120, '20 Rue Royale, 69001 Lyon', '/images/activities/mere-brazier.jpg', 'gastronomie', 'lyon', 'premium'),
('Le Bistrot de l''Institut', 'Cuisine raffinée', 95, '151 Cours Lafayette, 69003 Lyon', '/images/activities/bistrot-institut.jpg', 'gastronomie', 'lyon', 'premium'),
('Le Bistrot de la Place', 'Restaurant gastronomique', 110, '20 Place des Terreaux, 69001 Lyon', '/images/activities/bistrot-place.jpg', 'gastronomie', 'lyon', 'premium'),
('Le Bistrot de la Presqu''île', 'Cuisine contemporaine', 105, '1 Rue de la République, 69002 Lyon', '/images/activities/bistrot-presquile.jpg', 'gastronomie', 'lyon', 'premium'),
('Le Bistrot de la Confluence', 'Restaurant gastronomique', 115, '86 Quai Perrache, 69002 Lyon', '/images/activities/bistrot-confluence.jpg', 'gastronomie', 'lyon', 'premium');

-- Gastronomie Lyon - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dîner à la Tour Rose', 'Expérience gastronomique exclusive', 250, '22 Rue du Boeuf, 69005 Lyon', '/images/activities/tour-rose.jpg', 'gastronomie', 'lyon', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 450, 'Lyon', '/images/activities/chef-lyon.jpg', 'gastronomie', 'lyon', 'luxe'),
('Dîner Croisière VIP', 'Dîner gastronomique sur la Saône', 350, 'Quai de la Saône, 69005 Lyon', '/images/activities/croisiere-lyon.jpg', 'gastronomie', 'lyon', 'luxe'),
('Cours de Cuisine Lyonnaise', 'Cours avec un chef étoilé', 300, 'Lyon', '/images/activities/cours-lyon.jpg', 'gastronomie', 'lyon', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques lyonnaises', 200, 'Lyon', '/images/activities/degustation-lyon.jpg', 'gastronomie', 'lyon', 'luxe');

-- Culture Marseille - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Vieux-Port', 'Port historique de Marseille', 0, 'Vieux-Port, 13001 Marseille', '/images/activities/vieux-port.jpg', 'culture', 'marseille', 'gratuit'),
('Notre-Dame de la Garde', 'Basilique emblématique surplombant la ville', 0, 'Rue Fort du Sanctuaire, 13006 Marseille', '/images/activities/notre-dame-garde.jpg', 'culture', 'marseille', 'gratuit'),
('Quartier du Panier', 'Plus vieux quartier de Marseille', 0, 'Le Panier, 13002 Marseille', '/images/activities/panier.jpg', 'culture', 'marseille', 'gratuit'),
('Corniche Kennedy', 'Promenade maritime panoramique', 0, 'Corniche Kennedy, 13007 Marseille', '/images/activities/corniche.jpg', 'culture', 'marseille', 'gratuit'),
('Place aux Huiles', 'Place historique du Vieux-Port', 0, 'Place aux Huiles, 13001 Marseille', '/images/activities/place-huiles.jpg', 'culture', 'marseille', 'gratuit');

-- Culture Marseille - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('MuCEM', 'Musée des civilisations de l''Europe et de la Méditerranée', 12, '1 Esplanade du J4, 13002 Marseille', '/images/activities/mucem.jpg', 'culture', 'marseille', 'budget'),
('Musée d''Histoire de Marseille', 'Histoire de la plus ancienne ville de France', 10, '2 Rue Henri Barbusse, 13001 Marseille', '/images/activities/histoire-marseille.jpg', 'culture', 'marseille', 'budget'),
('Villa Méditerranée', 'Centre de rencontres et d''expositions', 8, 'Esplanade du J4, 13002 Marseille', '/images/activities/villa-med.jpg', 'culture', 'marseille', 'budget'),
('Fondation Regards de Provence', 'Art contemporain provençal', 10, 'Allée Regards de Provence, 13002 Marseille', '/images/activities/regards-provence.jpg', 'culture', 'marseille', 'budget'),
('Musée des Arts Africains', 'Collection d''art africain', 8, '2 Rue de la Charité, 13002 Marseille', '/images/activities/arts-africains.jpg', 'culture', 'marseille', 'budget');

-- Culture Marseille - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Opéra de Marseille', 'Spectacle lyrique', 40, '2 Rue Molière, 13001 Marseille', '/images/activities/opera-marseille.jpg', 'culture', 'marseille', 'moyen'),
('Théâtre du Gymnase', 'Théâtre historique', 35, '4 Rue du Théâtre Français, 13001 Marseille', '/images/activities/gymnase.jpg', 'culture', 'marseille', 'moyen'),
('Palais des Arts', 'Centre culturel et artistique', 30, '1 Place Carli, 13001 Marseille', '/images/activities/palais-arts.jpg', 'culture', 'marseille', 'moyen'),
('Théâtre National de Marseille', 'Scène contemporaine', 25, '20 Quai de Rive Neuve, 13007 Marseille', '/images/activities/theatre-national.jpg', 'culture', 'marseille', 'moyen'),
('Espace Julien', 'Salle de spectacles alternative', 20, '39 Cours Julien, 13006 Marseille', '/images/activities/espace-julien.jpg', 'culture', 'marseille', 'moyen');

-- Culture Marseille - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Festival de Marseille', 'Festival pluridisciplinaire', 55, 'Marseille', '/images/activities/festival-marseille.jpg', 'culture', 'marseille', 'premium'),
('Festival Jazz des Cinq Continents', 'Festival de jazz international', 45, 'Marseille', '/images/activities/jazz-continents.jpg', 'culture', 'marseille', 'premium'),
('Festival Actoral', 'Festival d''art contemporain', 50, 'Marseille', '/images/activities/actoral.jpg', 'culture', 'marseille', 'premium'),
('Festival Mars en Baroque', 'Festival de musique baroque', 40, 'Marseille', '/images/activities/mars-baroque.jpg', 'culture', 'marseille', 'premium'),
('Festival Babel Med Music', 'Festival de musiques du monde', 35, 'Marseille', '/images/activities/babel-med.jpg', 'culture', 'marseille', 'premium');

-- Culture Marseille - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Visite Privée du MuCEM', 'Accès exclusif au musée', 200, '1 Esplanade du J4, 13002 Marseille', '/images/activities/mucem-prive.jpg', 'culture', 'marseille', 'luxe'),
('Dîner à Notre-Dame de la Garde', 'Expérience gastronomique avec vue', 300, 'Rue Fort du Sanctuaire, 13006 Marseille', '/images/activities/notre-dame-diner.jpg', 'culture', 'marseille', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 500, 'Marseille', '/images/activities/weekend-marseille.jpg', 'culture', 'marseille', 'luxe'),
('Croisière Culturelle Privée', 'Tour des calanques en yacht', 400, 'Vieux-Port, 13001 Marseille', '/images/activities/croisiere-culture.jpg', 'culture', 'marseille', 'luxe'),
('Soirée Privée au Palais des Arts', 'Spectacle privé', 350, '1 Place Carli, 13001 Marseille', '/images/activities/palais-prive.jpg', 'culture', 'marseille', 'luxe');

-- Gastronomie Marseille - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Marché des Capucins', 'Plus grand marché de Marseille', 0, 'Place des Capucins, 13001 Marseille', '/images/activities/capucins.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché du Prado', 'Marché provençal traditionnel', 0, 'Avenue du Prado, 13008 Marseille', '/images/activities/prado.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché de la Plaine', 'Marché bio et artisanal', 0, 'Place Jean Jaurès, 13001 Marseille', '/images/activities/plaine.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché de Noailles', 'Marché aux épices et produits exotiques', 0, 'Rue du Marché des Capucins, 13001 Marseille', '/images/activities/noailles.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché des Quais', 'Marché de poissons frais', 0, 'Quai des Belges, 13002 Marseille', '/images/activities/quais.jpg', 'gastronomie', 'marseille', 'gratuit');

-- Gastronomie Marseille - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Chez Etienne', 'Pizza traditionnelle marseillaise', 12, '43 Rue de Lorette, 13002 Marseille', '/images/activities/etienne.jpg', 'gastronomie', 'marseille', 'budget'),
('L''Epuisette', 'Restaurant de poissons', 15, '156 Rue du Vallon des Auffes, 13007 Marseille', '/images/activities/epuisette.jpg', 'gastronomie', 'marseille', 'budget'),
('Le Miramar', 'Bouillabaisse traditionnelle', 18, '12 Quai du Port, 13002 Marseille', '/images/activities/miramar.jpg', 'gastronomie', 'marseille', 'budget'),
('La Caravelle', 'Bar à tapas provençales', 15, '34 Quai du Port, 13002 Marseille', '/images/activities/caravelle.jpg', 'gastronomie', 'marseille', 'budget'),
('Le Petit Nice', 'Restaurant de fruits de mer', 20, '17 Rue des Braves, 13007 Marseille', '/images/activities/petit-nice.jpg', 'gastronomie', 'marseille', 'budget');

-- Gastronomie Marseille - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Château', 'Restaurant gastronomique provençal', 45, '8 Rue du Commandant André, 13008 Marseille', '/images/activities/chateau.jpg', 'gastronomie', 'marseille', 'moyen'),
('La Table d''Augustine', 'Cuisine méditerranéenne', 55, '35 Rue du Commandant André, 13008 Marseille', '/images/activities/augustine.jpg', 'gastronomie', 'marseille', 'moyen'),
('Le Malthazar', 'Restaurant bistronomique', 50, '19 Rue Fortia, 13001 Marseille', '/images/activities/malthazar.jpg', 'gastronomie', 'marseille', 'moyen'),
('La Coquille', 'Restaurant de fruits de mer', 60, '2 Rue du Théâtre Français, 13001 Marseille', '/images/activities/coquille.jpg', 'gastronomie', 'marseille', 'moyen'),
('Le Bistrot d''Edouard', 'Cuisine du marché', 40, '10 Rue d''Aubagne, 13001 Marseille', '/images/activities/edouard.jpg', 'gastronomie', 'marseille', 'moyen');

-- Gastronomie Marseille - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Petit Nice', 'Restaurant 3 étoiles Michelin', 165, '17 Rue des Braves, 13007 Marseille', '/images/activities/petit-nice-premium.jpg', 'gastronomie', 'marseille', 'premium'),
('AM par Alexandre Mazzia', 'Restaurant 3 étoiles Michelin', 195, '9 Rue des Trois Rois, 13006 Marseille', '/images/activities/mazzia.jpg', 'gastronomie', 'marseille', 'premium'),
('La Table du Fort', 'Restaurant gastronomique', 145, '8 Boulevard Charles Livon, 13007 Marseille', '/images/activities/fort.jpg', 'gastronomie', 'marseille', 'premium'),
('L''Epuisette', 'Restaurant gastronomique', 155, '156 Rue du Vallon des Auffes, 13007 Marseille', '/images/activities/epuisette-premium.jpg', 'gastronomie', 'marseille', 'premium'),
('Le Miramar', 'Restaurant gastronomique', 175, '12 Quai du Port, 13002 Marseille', '/images/activities/miramar-premium.jpg', 'gastronomie', 'marseille', 'premium');

-- Gastronomie Marseille - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dîner sur la Corniche', 'Expérience gastronomique avec vue', 300, 'Corniche Kennedy, 13007 Marseille', '/images/activities/corniche-diner.jpg', 'gastronomie', 'marseille', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Marseille', '/images/activities/chef-marseille.jpg', 'gastronomie', 'marseille', 'luxe'),
('Dîner Croisière VIP', 'Dîner gastronomique en mer', 400, 'Vieux-Port, 13001 Marseille', '/images/activities/croisiere-gastro.jpg', 'gastronomie', 'marseille', 'luxe'),
('Cours de Cuisine Méditerranéenne', 'Cours avec un chef étoilé', 350, 'Marseille', '/images/activities/cours-med.jpg', 'gastronomie', 'marseille', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques marseillaises', 250, 'Marseille', '/images/activities/degustation-marseille.jpg', 'gastronomie', 'marseille', 'luxe');

-- Culture Londres - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Hyde Park', 'Plus grand parc royal de Londres', 0, 'Hyde Park, London W2 2UH', '/images/activities/hyde-park.jpg', 'culture', 'londres', 'gratuit'),
('British Museum', 'Musée d''histoire et de culture', 0, 'Great Russell St, London WC1B 3DG', '/images/activities/british-museum.jpg', 'culture', 'londres', 'gratuit'),
('Tate Modern', 'Musée d''art moderne', 0, 'Bankside, London SE1 9TG', '/images/activities/tate-modern.jpg', 'culture', 'londres', 'gratuit'),
('National Gallery', 'Collection d''art européen', 0, 'Trafalgar Square, London WC2N 5DN', '/images/activities/national-gallery.jpg', 'culture', 'londres', 'gratuit'),
('St Paul''s Cathedral', 'Cathédrale historique', 0, 'St. Paul''s Churchyard, London EC4M 8AD', '/images/activities/st-pauls.jpg', 'culture', 'londres', 'gratuit');

-- Culture Londres - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Madame Tussauds', 'Musée de cire', 35, 'Marylebone Rd, London NW1 5LR', '/images/activities/madame-tussauds.jpg', 'culture', 'londres', 'budget'),
('London Eye', 'Grande roue sur la Tamise', 30, 'Riverside Building, County Hall, London SE1 7PB', '/images/activities/london-eye.jpg', 'culture', 'londres', 'budget'),
('Tower Bridge Exhibition', 'Histoire du pont', 12, 'Tower Bridge Rd, London SE1 2UP', '/images/activities/tower-bridge.jpg', 'culture', 'londres', 'budget'),
('Kensington Palace', 'Résidence royale', 25, 'Kensington Gardens, London W8 4PX', '/images/activities/kensington-palace.jpg', 'culture', 'londres', 'budget'),
('Hampton Court Palace', 'Palais Tudor', 25, 'Hampton Court Way, Molesey, East Molesey KT8 9AU', '/images/activities/hampton-court.jpg', 'culture', 'londres', 'budget');

-- Culture Londres - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('West End Show', 'Spectacle musical', 60, 'West End, London', '/images/activities/west-end.jpg', 'culture', 'londres', 'moyen'),
('Royal Opera House', 'Opéra et ballet', 70, 'Bow St, London WC2E 9DD', '/images/activities/royal-opera.jpg', 'culture', 'londres', 'moyen'),
('Shakespeare''s Globe', 'Théâtre élisabéthain', 45, '21 New Globe Walk, London SE1 9DT', '/images/activities/globe.jpg', 'culture', 'londres', 'moyen'),
('Royal Albert Hall', 'Salle de concert', 55, 'Kensington Gore, South Kensington, London SW7 2AP', '/images/activities/royal-albert.jpg', 'culture', 'londres', 'moyen'),
('National Theatre', 'Théâtre contemporain', 50, 'Upper Ground, London SE1 9PX', '/images/activities/national-theatre.jpg', 'culture', 'londres', 'moyen');

-- Culture Londres - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Afternoon Tea at The Ritz', 'Expérience traditionnelle', 80, '150 Piccadilly, London W1J 9BR', '/images/activities/ritz-tea.jpg', 'culture', 'londres', 'premium'),
('Private Tour of Buckingham Palace', 'Visite exclusive', 150, 'London SW1A 1AA', '/images/activities/buckingham.jpg', 'culture', 'londres', 'premium'),
('Wimbledon Tour', 'Visite des coulisses', 120, 'Church Rd, London SW19 5AE', '/images/activities/wimbledon.jpg', 'culture', 'londres', 'premium'),
('Private Viewing at Tate Modern', 'Accès VIP', 100, 'Bankside, London SE1 9TG', '/images/activities/tate-private.jpg', 'culture', 'londres', 'premium'),
('Royal Ascot Experience', 'Courses hippiques royales', 200, 'High St, Ascot SL5 7JX', '/images/activities/ascot.jpg', 'culture', 'londres', 'premium');

-- Culture Londres - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Private Helicopter Tour', 'Survol de Londres', 500, 'London Heliport, SE1', '/images/activities/helicopter.jpg', 'culture', 'londres', 'luxe'),
('Private Dinner at Tower Bridge', 'Dîner exclusif', 400, 'Tower Bridge Rd, London SE1 2UP', '/images/activities/tower-dinner.jpg', 'culture', 'londres', 'luxe'),
('VIP Box at Royal Opera House', 'Soirée privée', 600, 'Bow St, London WC2E 9DD', '/images/activities/opera-vip.jpg', 'culture', 'londres', 'luxe'),
('Private Tour of Westminster Abbey', 'Visite exclusive', 300, '20 Deans Yd, London SW1P 3PA', '/images/activities/westminster.jpg', 'culture', 'londres', 'luxe'),
('Luxury Weekend Experience', 'Expérience culturelle exclusive', 1000, 'London', '/images/activities/weekend-luxury.jpg', 'culture', 'londres', 'luxe');

-- Gastronomie Londres - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Borough Market', 'Marché alimentaire historique', 0, '8 Southwark St, London SE1 1TL', '/images/activities/borough.jpg', 'gastronomie', 'londres', 'gratuit'),
('Covent Garden Market', 'Marché couvert', 0, 'The Market Building, London WC2E 8RF', '/images/activities/covent.jpg', 'gastronomie', 'londres', 'gratuit'),
('Portobello Road Market', 'Marché de quartier', 0, 'Portobello Rd, London W10 5TY', '/images/activities/portobello.jpg', 'gastronomie', 'londres', 'gratuit'),
('Camden Market', 'Marché éclectique', 0, 'Camden Lock Pl, London NW1 8AF', '/images/activities/camden.jpg', 'gastronomie', 'londres', 'gratuit'),
('Brick Lane Market', 'Marché multiculturel', 0, 'Brick Ln, London E1 6QL', '/images/activities/brick-lane.jpg', 'gastronomie', 'londres', 'gratuit');

-- Gastronomie Londres - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dishoom', 'Restaurant indien', 15, '12 Upper St Martin''s Ln, London EC2 7LG', '/images/activities/dishoom.jpg', 'gastronomie', 'londres', 'budget'),
('Flat Iron', 'Steakhouse abordable', 12, '17 Beak St, London W1F 9RW', '/images/activities/flat-iron.jpg', 'gastronomie', 'londres', 'budget'),
('Honest Burgers', 'Burgers artisanaux', 10, '4 Meard St, London W1F 0EF', '/images/activities/honest.jpg', 'gastronomie', 'londres', 'budget'),
('Padella', 'Pâtes fraîches', 12, '6 Southwark St, London SE1 1TQ', '/images/activities/padella.jpg', 'gastronomie', 'londres', 'budget'),
('Franco Manca', 'Pizza napolitaine', 8, '4 Market Row, London SW9 8LD', '/images/activities/franco.jpg', 'gastronomie', 'londres', 'budget');

-- Gastronomie Londres - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('The Clove Club', 'Restaurant gastronomique', 65, '380 Old St, London EC1V 9LT', '/images/activities/clove.jpg', 'gastronomie', 'londres', 'moyen'),
('Barrafina', 'Restaurant espagnol', 55, '43 Drury Ln, London WC2B 5AJ', '/images/activities/barrafina.jpg', 'gastronomie', 'londres', 'moyen'),
('Hawksmoor', 'Steakhouse premium', 60, '157A Commercial St, London E1 6BJ', '/images/activities/hawksmoor.jpg', 'gastronomie', 'londres', 'moyen'),
('Polpo', 'Restaurant vénitien', 45, '41 Beak St, London W1F 9SB', '/images/activities/polpo.jpg', 'gastronomie', 'londres', 'moyen'),
('The Palomar', 'Cuisine méditerranéenne', 50, '34 Rupert St, London W1D 6DN', '/images/activities/palomar.jpg', 'gastronomie', 'londres', 'moyen');

-- Gastronomie Londres - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('The Fat Duck', 'Restaurant 3 étoiles Michelin', 325, 'High St, Bray SL6 2AQ', '/images/activities/fat-duck.jpg', 'gastronomie', 'londres', 'premium'),
('Core by Clare Smyth', 'Restaurant 3 étoiles Michelin', 195, '92 Kensington Park Rd, London W11 2PN', '/images/activities/core.jpg', 'gastronomie', 'londres', 'premium'),
('Restaurant Gordon Ramsay', 'Restaurant 3 étoiles Michelin', 170, '68 Royal Hospital Rd, London SW3 4HP', '/images/activities/ramsay.jpg', 'gastronomie', 'londres', 'premium'),
('Alain Ducasse at The Dorchester', 'Restaurant 3 étoiles Michelin', 185, '53 Park Ln, London W1K 1QA', '/images/activities/ducasse.jpg', 'gastronomie', 'londres', 'premium'),
('Sketch', 'Restaurant gastronomique', 165, '9 Conduit St, London W1S 2XG', '/images/activities/sketch.jpg', 'gastronomie', 'londres', 'premium');

-- Gastronomie Londres - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Private Chef Experience', 'Chef étoilé à domicile', 600, 'London', '/images/activities/private-chef.jpg', 'gastronomie', 'londres', 'luxe'),
('Dinner at The Shard', 'Dîner avec vue panoramique', 400, '32 London Bridge St, London SE1 9SG', '/images/activities/shard.jpg', 'gastronomie', 'londres', 'luxe'),
('Wine Tasting Masterclass', 'Dégustation de vins prestige', 300, 'London', '/images/activities/wine-tasting.jpg', 'gastronomie', 'londres', 'luxe'),
('Private Cooking Class', 'Cours de cuisine avec un chef étoilé', 350, 'London', '/images/activities/cooking-class.jpg', 'gastronomie', 'londres', 'luxe'),
('Luxury Food Tour', 'Tour gastronomique VIP', 500, 'London', '/images/activities/food-tour.jpg', 'gastronomie', 'londres', 'luxe');

-- Culture Rome - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Fontana di Trevi', 'Fontaine baroque célèbre', 0, 'Piazza di Trevi, 00187 Roma RM', '/images/activities/trevi.jpg', 'culture', 'rome', 'gratuit'),
('Piazza Navona', 'Place historique', 0, 'Piazza Navona, 00186 Roma RM', '/images/activities/navona.jpg', 'culture', 'rome', 'gratuit'),
('Piazza di Spagna', 'Place et escaliers', 0, 'Piazza di Spagna, 00187 Roma RM', '/images/activities/spagna.jpg', 'culture', 'rome', 'gratuit'),
('Villa Borghese', 'Parc public', 0, 'Piazzale Napoleone I, 00197 Roma RM', '/images/activities/borghese.jpg', 'culture', 'rome', 'gratuit'),
('Trastevere', 'Quartier historique', 0, 'Trastevere, 00153 Roma RM', '/images/activities/trastevere.jpg', 'culture', 'rome', 'gratuit');

-- Culture Rome - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Galleria Borghese', 'Musée d''art', 15, 'Piazzale Scipione Borghese, 5, 00197 Roma RM', '/images/activities/galleria-borghese.jpg', 'culture', 'rome', 'budget'),
('Musei Capitolini', 'Musées du Capitole', 15, 'Piazza del Campidoglio, 1, 00186 Roma RM', '/images/activities/capitolini.jpg', 'culture', 'rome', 'budget'),
('Palazzo Doria Pamphilj', 'Galerie d''art privée', 12, 'Via del Corso, 305, 00186 Roma RM', '/images/activities/doria.jpg', 'culture', 'rome', 'budget'),
('Museo Nazionale Romano', 'Art romain antique', 10, 'Via delle Terme di Diocleziano, 26, 00185 Roma RM', '/images/activities/nazionale.jpg', 'culture', 'rome', 'budget'),
('Galleria Nazionale d''Arte Antica', 'Art ancien', 12, 'Via delle Quattro Fontane, 13, 00184 Roma RM', '/images/activities/galleria-antica.jpg', 'culture', 'rome', 'budget');

-- Culture Rome - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Opéra de Rome', 'Spectacle lyrique', 50, 'Piazza Beniamino Gigli, 1, 00184 Roma RM', '/images/activities/opera-rome.jpg', 'culture', 'rome', 'moyen'),
('Teatro Argentina', 'Théâtre historique', 40, 'Largo di Torre Argentina, 52, 00186 Roma RM', '/images/activities/argentina.jpg', 'culture', 'rome', 'moyen'),
('Auditorium Parco della Musica', 'Salle de concert', 45, 'Viale Pietro de Coubertin, 30, 00196 Roma RM', '/images/activities/auditorium.jpg', 'culture', 'rome', 'moyen'),
('Teatro Sistina', 'Théâtre de variétés', 35, 'Via Sistina, 129, 00187 Roma RM', '/images/activities/sistina.jpg', 'culture', 'rome', 'moyen'),
('Teatro Eliseo', 'Théâtre contemporain', 30, 'Via Nazionale, 183, 00184 Roma RM', '/images/activities/eliseo.jpg', 'culture', 'rome', 'moyen');

-- Culture Rome - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Visite Guidée du Vatican', 'Tour exclusif', 80, 'Vatican City', '/images/activities/vatican-tour.jpg', 'culture', 'rome', 'premium'),
('Dîner au Château Saint-Ange', 'Expérience gastronomique', 120, 'Lungotevere Castello, 50, 00193 Roma RM', '/images/activities/saint-ange.jpg', 'culture', 'rome', 'premium'),
('Festival de Rome', 'Festival international', 70, 'Rome', '/images/activities/festival-rome.jpg', 'culture', 'rome', 'premium'),
('Soirée à la Villa Médicis', 'Événement culturel', 100, 'Viale della Trinità dei Monti, 1, 00187 Roma RM', '/images/activities/medicis.jpg', 'culture', 'rome', 'premium'),
('Festival des Deux Mondes', 'Festival pluridisciplinaire', 90, 'Rome', '/images/activities/deux-mondes.jpg', 'culture', 'rome', 'premium');

-- Culture Rome - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Visite Privée du Colisée', 'Accès VIP', 300, 'Piazza del Colosseo, 1, 00184 Roma RM', '/images/activities/colisee-prive.jpg', 'culture', 'rome', 'luxe'),
('Dîner au Forum Romain', 'Expérience exclusive', 400, 'Via della Salara Vecchia, 5/6, 00186 Roma RM', '/images/activities/forum-diner.jpg', 'culture', 'rome', 'luxe'),
('Vol en Hélicoptère', 'Survol de Rome', 500, 'Rome', '/images/activities/helico-rome.jpg', 'culture', 'rome', 'luxe'),
('Soirée Privée au Vatican', 'Événement exclusif', 600, 'Vatican City', '/images/activities/vatican-prive.jpg', 'culture', 'rome', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 1000, 'Rome', '/images/activities/weekend-rome.jpg', 'culture', 'rome', 'luxe');

-- Gastronomie Rome - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Mercato Centrale', 'Marché couvert', 0, 'Via Giovanni Giolitti, 36, 00185 Roma RM', '/images/activities/mercato-centrale.jpg', 'gastronomie', 'rome', 'gratuit'),
('Campo de'' Fiori', 'Marché en plein air', 0, 'Campo de'' Fiori, 00186 Roma RM', '/images/activities/campo-fiori.jpg', 'gastronomie', 'rome', 'gratuit'),
('Mercato Trionfale', 'Marché local', 0, 'Via Andrea Doria, 3, 00192 Roma RM', '/images/activities/trionfale.jpg', 'gastronomie', 'rome', 'gratuit'),
('Mercato di Testaccio', 'Marché traditionnel', 0, 'Via Beniamino Franklin, 00153 Roma RM', '/images/activities/testaccio.jpg', 'gastronomie', 'rome', 'gratuit'),
('Mercato Esquilino', 'Marché multiculturel', 0, 'Via Principe Amedeo, 184, 00185 Roma RM', '/images/activities/esquilino.jpg', 'gastronomie', 'rome', 'gratuit');

-- Gastronomie Rome - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Da Enzo al 29', 'Trattoria traditionnelle', 15, 'Via dei Vascellari, 29, 00153 Roma RM', '/images/activities/enzo.jpg', 'gastronomie', 'rome', 'budget'),
('Supplizio', 'Supplì et street food', 10, 'Via dei Banchi Vecchi, 143, 00186 Roma RM', '/images/activities/supplizio.jpg', 'gastronomie', 'rome', 'budget'),
('Pizzarium', 'Pizza al taglio', 8, 'Via della Meloria, 43, 00136 Roma RM', '/images/activities/pizzarium.jpg', 'gastronomie', 'rome', 'budget'),
('Trapizzino', 'Street food romain', 12, 'Piazza Trilussa, 46, 00153 Roma RM', '/images/activities/trapizzino.jpg', 'gastronomie', 'rome', 'budget'),
('Filetti di Baccalà', 'Friture traditionnelle', 10, 'Largo dei Librari, 88, 00186 Roma RM', '/images/activities/filetti.jpg', 'gastronomie', 'rome', 'budget');

-- Gastronomie Rome - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Roscioli', 'Restaurant et boulangerie', 45, 'Via dei Giubbonari, 21, 00186 Roma RM', '/images/activities/roscioli.jpg', 'gastronomie', 'rome', 'moyen'),
('Armando al Pantheon', 'Cuisine romaine', 50, 'Salita dei Crescenzi, 31, 00186 Roma RM', '/images/activities/armando.jpg', 'gastronomie', 'rome', 'moyen'),
('Osteria dell''Angelo', 'Cuisine traditionnelle', 55, 'Via G. Bettolo, 32, 00195 Roma RM', '/images/activities/angelo.jpg', 'gastronomie', 'rome', 'moyen'),
('Glass Hostaria', 'Cuisine fusion', 60, 'Vicolo del Cinque, 58, 00153 Roma RM', '/images/activities/glass.jpg', 'gastronomie', 'rome', 'moyen'),
('Cesare al Casaletto', 'Osteria romaine', 40, 'Via del Casaletto, 45, 00151 Roma RM', '/images/activities/cesare.jpg', 'gastronomie', 'rome', 'moyen');

-- Gastronomie Rome - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('La Pergola', 'Restaurant 3 étoiles Michelin', 250, 'Via Alberto Cadlolo, 101, 00136 Roma RM', '/images/activities/pergola.jpg', 'gastronomie', 'rome', 'premium'),
('Imàgo', 'Restaurant gastronomique', 180, 'Piazza della Trinità dei Monti, 6, 00187 Roma RM', '/images/activities/imago.jpg', 'gastronomie', 'rome', 'premium'),
('Aroma', 'Restaurant gastronomique', 200, 'Via Labicana, 125, 00184 Roma RM', '/images/activities/aroma.jpg', 'gastronomie', 'rome', 'premium'),
('Glass Hostaria', 'Restaurant gastronomique', 150, 'Vicolo del Cinque, 58, 00153 Roma RM', '/images/activities/glass-premium.jpg', 'gastronomie', 'rome', 'premium'),
('La Terrazza', 'Restaurant gastronomique', 170, 'Via Ludovisi, 49, 00187 Roma RM', '/images/activities/terrazza.jpg', 'gastronomie', 'rome', 'premium');

-- Gastronomie Rome - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dîner au Vatican', 'Expérience gastronomique exclusive', 400, 'Vatican City', '/images/activities/vatican-diner.jpg', 'gastronomie', 'rome', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Rome', '/images/activities/chef-rome.jpg', 'gastronomie', 'rome', 'luxe'),
('Dîner sur la Terrasse du Capitole', 'Dîner avec vue panoramique', 350, 'Piazza del Campidoglio, 1, 00186 Roma RM', '/images/activities/capitole-diner.jpg', 'gastronomie', 'rome', 'luxe'),
('Cours de Cuisine Romaine', 'Cours avec un chef étoilé', 300, 'Rome', '/images/activities/cours-rome.jpg', 'gastronomie', 'rome', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques romaines', 250, 'Rome', '/images/activities/degustation-rome.jpg', 'gastronomie', 'rome', 'luxe');

-- Culture New York - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Central Park', 'Plus grand parc urbain de New York', 0, 'New York, NY 10024', '/images/activities/central-park.jpg', 'culture', 'new-york', 'gratuit'),
('Brooklyn Bridge', 'Pont historique avec vue sur Manhattan', 0, 'Brooklyn Bridge, New York, NY 10038', '/images/activities/brooklyn-bridge.jpg', 'culture', 'new-york', 'gratuit'),
('High Line', 'Parc linéaire sur une ancienne voie ferrée', 0, '820 Washington St, New York, NY 10014', '/images/activities/high-line.jpg', 'culture', 'new-york', 'gratuit'),
('Times Square', 'Place emblématique de Manhattan', 0, 'Times Square, New York, NY 10036', '/images/activities/times-square.jpg', 'culture', 'new-york', 'gratuit'),
('Wall Street', 'Centre financier historique', 0, 'Wall St, New York, NY 10005', '/images/activities/wall-street.jpg', 'culture', 'new-york', 'gratuit');

-- Culture New York - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Empire State Building', 'Gratte-ciel emblématique', 38, '350 5th Ave, New York, NY 10118', '/images/activities/empire-state.jpg', 'culture', 'new-york', 'budget'),
('Top of the Rock', 'Terrasse d''observation', 40, '30 Rockefeller Plaza, New York, NY 10112', '/images/activities/top-rock.jpg', 'culture', 'new-york', 'budget'),
('Statue de la Liberté', 'Monument national', 25, 'Liberty Island, New York, NY 10004', '/images/activities/statue-liberte.jpg', 'culture', 'new-york', 'budget'),
('One World Observatory', 'Observatoire du One World Trade Center', 35, '117 West St, New York, NY 10007', '/images/activities/one-world.jpg', 'culture', 'new-york', 'budget'),
('Madame Tussauds', 'Musée de cire', 30, '234 W 42nd St, New York, NY 10036', '/images/activities/tussauds-ny.jpg', 'culture', 'new-york', 'budget');

-- Culture New York - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Broadway Show', 'Spectacle musical', 80, 'Broadway, New York, NY', '/images/activities/broadway.jpg', 'culture', 'new-york', 'moyen'),
('Metropolitan Opera', 'Opéra prestigieux', 70, '30 Lincoln Center Plaza, New York, NY 10023', '/images/activities/met-opera.jpg', 'culture', 'new-york', 'moyen'),
('Carnegie Hall', 'Salle de concert historique', 60, '881 7th Ave, New York, NY 10019', '/images/activities/carnegie.jpg', 'culture', 'new-york', 'moyen'),
('Radio City Music Hall', 'Salle de spectacle Art déco', 50, '1260 6th Ave, New York, NY 10020', '/images/activities/radio-city.jpg', 'culture', 'new-york', 'moyen'),
('Lincoln Center', 'Centre culturel majeur', 55, '70 Lincoln Center Plaza, New York, NY 10023', '/images/activities/lincoln-center.jpg', 'culture', 'new-york', 'moyen');

-- Culture New York - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('VIP Broadway Experience', 'Accès coulisses et rencontre avec les artistes', 150, 'Broadway, New York, NY', '/images/activities/broadway-vip.jpg', 'culture', 'new-york', 'premium'),
('Private Tour of MoMA', 'Visite exclusive du musée', 120, '11 W 53rd St, New York, NY 10019', '/images/activities/moma-private.jpg', 'culture', 'new-york', 'premium'),
('Guggenheim VIP Tour', 'Visite guidée privée', 100, '1071 5th Ave, New York, NY 10128', '/images/activities/guggenheim-vip.jpg', 'culture', 'new-york', 'premium'),
('Private Tour of The Met', 'Visite exclusive du Metropolitan Museum', 130, '1000 5th Ave, New York, NY 10028', '/images/activities/met-private.jpg', 'culture', 'new-york', 'premium'),
('VIP Access to Rockefeller Center', 'Accès exclusif aux studios NBC', 140, '30 Rockefeller Plaza, New York, NY 10112', '/images/activities/rockefeller-vip.jpg', 'culture', 'new-york', 'premium');

-- Culture New York - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Private Helicopter Tour', 'Survol de Manhattan', 600, 'New York Heliport, New York, NY', '/images/activities/helicopter-ny.jpg', 'culture', 'new-york', 'luxe'),
('Private Dinner at Top of the Rock', 'Dîner exclusif avec vue panoramique', 500, '30 Rockefeller Plaza, New York, NY 10112', '/images/activities/rock-dinner.jpg', 'culture', 'new-york', 'luxe'),
('VIP Box at Madison Square Garden', 'Soirée privée', 800, '4 Pennsylvania Plaza, New York, NY 10001', '/images/activities/msg-vip.jpg', 'culture', 'new-york', 'luxe'),
('Private Tour of Ellis Island', 'Visite exclusive', 400, 'Ellis Island, New York, NY 10004', '/images/activities/ellis-island.jpg', 'culture', 'new-york', 'luxe'),
('Luxury Weekend Experience', 'Expérience culturelle exclusive', 1200, 'New York, NY', '/images/activities/weekend-ny.jpg', 'culture', 'new-york', 'luxe');

-- Gastronomie New York - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Chelsea Market', 'Marché couvert gastronomique', 0, '75 9th Ave, New York, NY 10011', '/images/activities/chelsea-market.jpg', 'gastronomie', 'new-york', 'gratuit'),
('Smorgasburg', 'Marché alimentaire en plein air', 0, '90 Kent Ave, Brooklyn, NY 11211', '/images/activities/smorgasburg.jpg', 'gastronomie', 'new-york', 'gratuit'),
('Union Square Greenmarket', 'Marché fermier', 0, 'Union Square, New York, NY 10003', '/images/activities/union-square.jpg', 'gastronomie', 'new-york', 'gratuit'),
('Eataly', 'Marché italien', 0, '200 5th Ave, New York, NY 10010', '/images/activities/eataly.jpg', 'gastronomie', 'new-york', 'gratuit'),
('Gansevoort Market', 'Marché gastronomique', 0, '52 Gansevoort St, New York, NY 10014', '/images/activities/gansevoort.jpg', 'gastronomie', 'new-york', 'gratuit');

-- Gastronomie New York - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Katz''s Delicatessen', 'Sandwich au pastrami traditionnel', 15, '205 E Houston St, New York, NY 10002', '/images/activities/katz.jpg', 'gastronomie', 'new-york', 'budget'),
('Joe''s Pizza', 'Pizza à la new-yorkaise', 12, '7 Carmine St, New York, NY 10014', '/images/activities/joes-pizza.jpg', 'gastronomie', 'new-york', 'budget'),
('Russ & Daughters', 'Bagels et saumon fumé', 10, '179 E Houston St, New York, NY 10002', '/images/activities/russ.jpg', 'gastronomie', 'new-york', 'budget'),
('Gray''s Papaya', 'Hot-dogs traditionnels', 8, '2090 Broadway, New York, NY 10023', '/images/activities/grays.jpg', 'gastronomie', 'new-york', 'budget'),
('Shake Shack', 'Burgers et milkshakes', 12, '200 Broadway, New York, NY 10038', '/images/activities/shake-shack.jpg', 'gastronomie', 'new-york', 'budget');

-- Gastronomie New York - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Peter Luger', 'Steakhouse historique', 65, '178 Broadway, Brooklyn, NY 11211', '/images/activities/peter-luger.jpg', 'gastronomie', 'new-york', 'moyen'),
('Koreatown Food Tour', 'Découverte de la cuisine coréenne', 55, '32nd St, New York, NY 10001', '/images/activities/koreatown.jpg', 'gastronomie', 'new-york', 'moyen'),
('Lombardi''s', 'Première pizzeria d''Amérique', 45, '32 Spring St, New York, NY 10012', '/images/activities/lombardis.jpg', 'gastronomie', 'new-york', 'moyen'),
('Katz''s Deli Experience', 'Expérience complète', 50, '205 E Houston St, New York, NY 10002', '/images/activities/katz-experience.jpg', 'gastronomie', 'new-york', 'moyen'),
('Chelsea Market Food Tour', 'Découverte culinaire', 60, '75 9th Ave, New York, NY 10011', '/images/activities/chelsea-tour.jpg', 'gastronomie', 'new-york', 'moyen');

-- Gastronomie New York - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Bernardin', 'Restaurant 3 étoiles Michelin', 195, '155 W 51st St, New York, NY 10019', '/images/activities/bernardin.jpg', 'gastronomie', 'new-york', 'premium'),
('Per Se', 'Restaurant 3 étoiles Michelin', 350, '10 Columbus Circle, New York, NY 10019', '/images/activities/per-se.jpg', 'gastronomie', 'new-york', 'premium'),
('Eleven Madison Park', 'Restaurant 3 étoiles Michelin', 335, '11 Madison Ave, New York, NY 10010', '/images/activities/eleven-madison.jpg', 'gastronomie', 'new-york', 'premium'),
('Gramercy Tavern', 'Restaurant gastronomique', 175, '42 E 20th St, New York, NY 10003', '/images/activities/gramercy.jpg', 'gastronomie', 'new-york', 'premium'),
('Momofuku Ko', 'Restaurant gastronomique', 225, '8 Extra Pl, New York, NY 10003', '/images/activities/momofuku.jpg', 'gastronomie', 'new-york', 'premium');

-- Gastronomie New York - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Private Chef Experience', 'Chef étoilé à domicile', 800, 'New York, NY', '/images/activities/private-chef-ny.jpg', 'gastronomie', 'new-york', 'luxe'),
('Dinner at Top of the Rock', 'Dîner gastronomique avec vue', 600, '30 Rockefeller Plaza, New York, NY 10112', '/images/activities/rock-dinner-gastro.jpg', 'gastronomie', 'new-york', 'luxe'),
('Wine Tasting Masterclass', 'Dégustation de vins prestige', 400, 'New York, NY', '/images/activities/wine-ny.jpg', 'gastronomie', 'new-york', 'luxe'),
('Private Cooking Class', 'Cours avec un chef étoilé', 500, 'New York, NY', '/images/activities/cooking-ny.jpg', 'gastronomie', 'new-york', 'luxe'),
('Luxury Food Tour', 'Tour gastronomique VIP', 700, 'New York, NY', '/images/activities/food-tour-ny.jpg', 'gastronomie', 'new-york', 'luxe');

-- Culture Bruxelles - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Grand Place', 'Place centrale historique', 0, 'Grote Markt, 1000 Brussel', '/images/activities/grand-place.jpg', 'culture', 'bruxelles', 'gratuit'),
('Manneken Pis', 'Statue emblématique', 0, 'Rue de l''Étuve 31, 1000 Brussel', '/images/activities/manneken-pis.jpg', 'culture', 'bruxelles', 'gratuit'),
('Parc du Cinquantenaire', 'Parc historique avec arc de triomphe', 0, 'Parc du Cinquantenaire, 1000 Brussel', '/images/activities/cinquantenaire.jpg', 'culture', 'bruxelles', 'gratuit'),
('Quartier des Marolles', 'Quartier populaire historique', 0, 'Rue Haute, 1000 Brussel', '/images/activities/marolles.jpg', 'culture', 'bruxelles', 'gratuit'),
('Place Royale', 'Place néoclassique', 0, 'Place Royale, 1000 Brussel', '/images/activities/place-royale.jpg', 'culture', 'bruxelles', 'gratuit');

-- Culture Bruxelles - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Musées Royaux des Beaux-Arts', 'Collection d''art classique et moderne', 15, 'Rue de la Régence 3, 1000 Brussel', '/images/activities/beaux-arts.jpg', 'culture', 'bruxelles', 'budget'),
('Musée des Instruments de Musique', 'Collection d''instruments historiques', 12, 'Rue Montagne de la Cour 2, 1000 Brussel', '/images/activities/mim.jpg', 'culture', 'bruxelles', 'budget'),
('Musée Horta', 'Art nouveau', 10, 'Rue Américaine 25, 1060 Saint-Gilles', '/images/activities/horta.jpg', 'culture', 'bruxelles', 'budget'),
('Musée du Costume et de la Dentelle', 'Histoire de la mode', 8, 'Rue de la Violette 12, 1000 Brussel', '/images/activities/costume.jpg', 'culture', 'bruxelles', 'budget'),
('Musée de la Ville de Bruxelles', 'Histoire de la ville', 10, 'Grand Place 1, 1000 Brussel', '/images/activities/ville-bruxelles.jpg', 'culture', 'bruxelles', 'budget');

-- Culture Bruxelles - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Théâtre Royal de la Monnaie', 'Opéra national', 50, 'Place de la Monnaie, 1000 Brussel', '/images/activities/monnaie.jpg', 'culture', 'bruxelles', 'moyen'),
('Palais des Beaux-Arts', 'Centre culturel majeur', 45, 'Rue Ravenstein 23, 1000 Brussel', '/images/activities/bozar.jpg', 'culture', 'bruxelles', 'moyen'),
('Théâtre National', 'Théâtre contemporain', 35, 'Boulevard Emile Jacqmain 111-115, 1000 Brussel', '/images/activities/theatre-national.jpg', 'culture', 'bruxelles', 'moyen'),
('Cirque Royal', 'Salle de spectacle historique', 40, 'Rue de l''Enseignement 81, 1000 Brussel', '/images/activities/cirque-royal.jpg', 'culture', 'bruxelles', 'moyen'),
('Flagey', 'Centre culturel et musical', 30, 'Place Sainte-Croix, 1050 Ixelles', '/images/activities/flagey.jpg', 'culture', 'bruxelles', 'moyen');

-- Culture Bruxelles - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Festival de Bruxelles', 'Festival pluridisciplinaire', 70, 'Bruxelles', '/images/activities/festival-bruxelles.jpg', 'culture', 'bruxelles', 'premium'),
('Kunstenfestivaldesarts', 'Festival d''arts contemporains', 60, 'Bruxelles', '/images/activities/kunstenfestival.jpg', 'culture', 'bruxelles', 'premium'),
('Festival de Jazz', 'Festival international de jazz', 55, 'Bruxelles', '/images/activities/jazz-bruxelles.jpg', 'culture', 'bruxelles', 'premium'),
('Festival de Musique Ancienne', 'Festival de musique baroque', 65, 'Bruxelles', '/images/activities/musique-ancienne.jpg', 'culture', 'bruxelles', 'premium'),
('Festival de Danse', 'Festival international de danse', 50, 'Bruxelles', '/images/activities/danse-bruxelles.jpg', 'culture', 'bruxelles', 'premium');

-- Culture Bruxelles - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Visite Privée du Palais Royal', 'Accès exclusif', 300, 'Place des Palais, 1000 Brussel', '/images/activities/palais-royal.jpg', 'culture', 'bruxelles', 'luxe'),
('Dîner à l''Atomium', 'Expérience gastronomique', 400, 'Square de l''Atomium, 1020 Brussel', '/images/activities/atomium-diner.jpg', 'culture', 'bruxelles', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 600, 'Bruxelles', '/images/activities/weekend-bruxelles.jpg', 'culture', 'bruxelles', 'luxe'),
('Soirée Privée à la Monnaie', 'Spectacle privé', 500, 'Place de la Monnaie, 1000 Brussel', '/images/activities/monnaie-prive.jpg', 'culture', 'bruxelles', 'luxe'),
('Expérience Art Nouveau Exclusive', 'Tour privé des plus beaux bâtiments', 350, 'Bruxelles', '/images/activities/art-nouveau.jpg', 'culture', 'bruxelles', 'luxe');

-- Gastronomie Bruxelles - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Marché des Abattoirs', 'Marché alimentaire traditionnel', 0, 'Rue Ropsy Chaudron 24, 1070 Anderlecht', '/images/activities/abattoirs.jpg', 'gastronomie', 'bruxelles', 'gratuit'),
('Marché du Midi', 'Plus grand marché d''Europe', 0, 'Boulevard du Midi, 1000 Brussel', '/images/activities/midi.jpg', 'gastronomie', 'bruxelles', 'gratuit'),
('Marché des Capucins', 'Marché de quartier', 0, 'Place des Capucins, 1000 Brussel', '/images/activities/capucins.jpg', 'gastronomie', 'bruxelles', 'gratuit'),
('Marché de la Place du Jeu de Balle', 'Marché aux puces et alimentaire', 0, 'Place du Jeu de Balle, 1000 Brussel', '/images/activities/jeu-balle.jpg', 'gastronomie', 'bruxelles', 'gratuit'),
('Marché de la Place Sainte-Catherine', 'Marché de quartier', 0, 'Place Sainte-Catherine, 1000 Brussel', '/images/activities/sainte-catherine.jpg', 'gastronomie', 'bruxelles', 'gratuit');

-- Gastronomie Bruxelles - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Le Bouchon des Filles', 'Bouchon lyonnais traditionnel', 15, '20 Rue Sergent Blandan, 69001 Lyon', '/images/activities/bouchon-filles.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Le Garet', 'Restaurant de quartier', 12, '7 Rue du Garet, 69001 Lyon', '/images/activities/garet.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Le Bistrot de Saint-Paul', 'Cuisine traditionnelle', 14, '1 Rue de la Monnaie, 69005 Lyon', '/images/activities/bistrot-saint-paul.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Le Café des Fédérations', 'Bouchon lyonnais', 16, '8 Rue du Major Martin, 69001 Lyon', '/images/activities/cafe-federations.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Le Bistrot de l''Opéra', 'Restaurant convivial', 13, '1 Place de la Comédie, 69001 Lyon', '/images/activities/bistrot-opera.jpg', 'gastronomie', 'bruxelles', 'budget');

-- Gastronomie Bruxelles - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Comme Chez Soi', 'Restaurant gastronomique', 65, 'Place Rouppe 23, 1000 Brussel', '/images/activities/comme-chez-soi.jpg', 'gastronomie', 'bruxelles', 'moyen'),
('La Quincaillerie', 'Restaurant bistronomique', 55, 'Rue du Page 45, 1050 Ixelles', '/images/activities/quincaillerie.jpg', 'gastronomie', 'bruxelles', 'moyen'),
('Le Wine Bar', 'Bar à vin et cuisine raffinée', 50, 'Rue de la Paix 5, 1050 Ixelles', '/images/activities/wine-bar.jpg', 'gastronomie', 'bruxelles', 'moyen'),
('L''Idiot du Village', 'Cuisine créative', 45, 'Rue Notre-Seigneur 19, 1000 Brussel', '/images/activities/idiot-village.jpg', 'gastronomie', 'bruxelles', 'moyen'),
('Le Bistro', 'Cuisine française', 60, 'Rue de Namur 4, 1000 Brussel', '/images/activities/bistro-bruxelles.jpg', 'gastronomie', 'bruxelles', 'moyen');

-- Gastronomie Bruxelles - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Hof van Cleve', 'Restaurant 3 étoiles Michelin', 250, 'Riemegemstraat 1, 9770 Kruishoutem', '/images/activities/hof-van-cleve.jpg', 'gastronomie', 'bruxelles', 'premium'),
('La Paix', 'Restaurant gastronomique', 180, 'Place du Grand Sablon 7, 1000 Brussel', '/images/activities/paix.jpg', 'gastronomie', 'bruxelles', 'premium'),
('Sea Grill', 'Restaurant de fruits de mer', 200, 'Rue Bodenbroekstraat 1, 1000 Brussel', '/images/activities/sea-grill.jpg', 'gastronomie', 'bruxelles', 'premium'),
('L''Air du Temps', 'Restaurant gastronomique', 190, 'Rue de L''Ermitage 1, 1490 Court-Saint-Etienne', '/images/activities/air-temps.jpg', 'gastronomie', 'bruxelles', 'premium'),
('De Karmeliet', 'Restaurant 3 étoiles Michelin', 220, 'Langestraat 19, 8000 Brugge', '/images/activities/karmeliet.jpg', 'gastronomie', 'bruxelles', 'premium');

-- Gastronomie Bruxelles - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dîner à l''Atomium', 'Expérience gastronomique exclusive', 400, 'Square de l''Atomium, 1020 Brussel', '/images/activities/atomium-diner-gastro.jpg', 'gastronomie', 'bruxelles', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 600, 'Bruxelles', '/images/activities/chef-bruxelles.jpg', 'gastronomie', 'bruxelles', 'luxe'),
('Dégustation de Bières Prestige', 'Découverte des bières belges', 300, 'Bruxelles', '/images/activities/bieres-prestige.jpg', 'gastronomie', 'bruxelles', 'luxe'),
('Cours de Cuisine Belge', 'Cours avec un chef étoilé', 350, 'Bruxelles', '/images/activities/cours-belge.jpg', 'gastronomie', 'bruxelles', 'luxe'),
('Luxury Food Tour', 'Tour gastronomique VIP', 500, 'Bruxelles', '/images/activities/food-tour-bruxelles.jpg', 'gastronomie', 'bruxelles', 'luxe');

-- Culture Madère - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Jardin Botanique', 'Collection de plantes exotiques', 0, 'Caminho do Meio, 9064-512 Funchal', '/images/activities/jardin-botanique.jpg', 'culture', 'madere', 'gratuit'),
('Mercado dos Lavradores', 'Marché traditionnel', 0, 'Rua Brigadeiro Oudinot, 9060-173 Funchal', '/images/activities/mercado-lavradores.jpg', 'culture', 'madere', 'gratuit'),
('Parc de Santa Catarina', 'Parc avec vue sur le port', 0, 'Parque de Santa Catarina, 9000-001 Funchal', '/images/activities/santa-catarina.jpg', 'culture', 'madere', 'gratuit'),
('Quartier de Santa Maria', 'Quartier historique', 0, 'Rua de Santa Maria, 9060-291 Funchal', '/images/activities/santa-maria.jpg', 'culture', 'madere', 'gratuit'),
('Parc Municipal', 'Parc central de Funchal', 0, 'Parque Municipal do Funchal, 9000-001 Funchal', '/images/activities/parc-municipal.jpg', 'culture', 'madere', 'gratuit');

-- Culture Madère - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Museu da Quinta das Cruzes', 'Musée d''art décoratif', 12, 'Calçada do Pico 1, 9000-206 Funchal', '/images/activities/quinta-cruzes.jpg', 'culture', 'madere', 'budget'),
('Museu de Arte Sacra', 'Art religieux', 10, 'Rua do Bispo 21, 9000-073 Funchal', '/images/activities/arte-sacra.jpg', 'culture', 'madere', 'budget'),
('Museu da Madeira', 'Histoire de l''île', 8, 'Rua dos Ferreiros 165, 9000-082 Funchal', '/images/activities/museu-madeira.jpg', 'culture', 'madere', 'budget'),
('Fortaleza de São Tiago', 'Forteresse historique', 10, 'Rua do Portão de São Tiago, 9060-250 Funchal', '/images/activities/fortaleza.jpg', 'culture', 'madere', 'budget'),
('Museu de História Natural', 'Histoire naturelle', 8, 'Rua da Mouraria 31, 9000-057 Funchal', '/images/activities/historia-natural.jpg', 'culture', 'madere', 'budget');

-- Culture Madère - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Teatro Municipal Baltazar Dias', 'Théâtre historique', 40, 'Avenida Arriaga, 9000-081 Funchal', '/images/activities/teatro-municipal.jpg', 'culture', 'madere', 'moyen'),
('Concert au Convento de Santa Clara', 'Concert de musique classique', 35, 'Calçada de Santa Clara 15, 9000-036 Funchal', '/images/activities/convento-santa-clara.jpg', 'culture', 'madere', 'moyen'),
('Festival de Jazz', 'Festival de jazz', 45, 'Funchal', '/images/activities/jazz-madeira.jpg', 'culture', 'madere', 'moyen'),
('Spectacle de Folclore', 'Danse et musique traditionnelle', 30, 'Funchal', '/images/activities/folclore.jpg', 'culture', 'madere', 'moyen'),
('Festival de Musique Classique', 'Festival de musique classique', 50, 'Funchal', '/images/activities/musique-classique.jpg', 'culture', 'madere', 'moyen');

-- Culture Madère - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Festival de Fleurs', 'Festival annuel', 70, 'Funchal', '/images/activities/festival-fleurs.jpg', 'culture', 'madere', 'premium'),
('Festival de Vin', 'Festival du vin de Madère', 80, 'Funchal', '/images/activities/festival-vin.jpg', 'culture', 'madere', 'premium'),
('Festival de Gastronomie', 'Festival culinaire', 65, 'Funchal', '/images/activities/festival-gastronomie.jpg', 'culture', 'madere', 'premium'),
('Festival de Musique', 'Festival international de musique', 75, 'Funchal', '/images/activities/festival-musique.jpg', 'culture', 'madere', 'premium'),
('Festival de Danse', 'Festival international de danse', 60, 'Funchal', '/images/activities/festival-danse.jpg', 'culture', 'madere', 'premium');

-- Culture Madère - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Vol en Hélicoptère', 'Survol de l''île', 400, 'Aeroporto da Madeira, 9100-105 Santa Cruz', '/images/activities/helicoptere-madeira.jpg', 'culture', 'madere', 'luxe'),
('Dîner au Monte Palace', 'Expérience gastronomique exclusive', 300, 'Caminho do Monte 174, 9050-288 Funchal', '/images/activities/monte-palace.jpg', 'culture', 'madere', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 600, 'Funchal', '/images/activities/weekend-madeira.jpg', 'culture', 'madere', 'luxe'),
('Croisière Privée', 'Tour de l''île en yacht', 500, 'Porto do Funchal, 9000-058 Funchal', '/images/activities/croisiere-privee.jpg', 'culture', 'madere', 'luxe'),
('Soirée Privée au Palácio de São Lourenço', 'Événement exclusif', 450, 'Avenida Zarco, 9000-059 Funchal', '/images/activities/palacio-sao-lourenco.jpg', 'culture', 'madere', 'luxe');

-- Gastronomie Madère - Gratuit
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Mercado dos Lavradores', 'Marché traditionnel', 0, 'Rua Brigadeiro Oudinot, 9060-173 Funchal', '/images/activities/mercado-lavradores-gastro.jpg', 'gastronomie', 'madere', 'gratuit'),
('Mercado Velho', 'Marché historique', 0, 'Rua dos Aranhas 24, 9000-044 Funchal', '/images/activities/mercado-velho.jpg', 'gastronomie', 'madere', 'gratuit'),
('Mercado de Santa Maria', 'Marché de quartier', 0, 'Rua de Santa Maria, 9060-291 Funchal', '/images/activities/mercado-santa-maria.jpg', 'gastronomie', 'madere', 'gratuit'),
('Mercado de Santo António', 'Marché local', 0, 'Rua de Santo António, 9000-001 Funchal', '/images/activities/mercado-santo-antonio.jpg', 'gastronomie', 'madere', 'gratuit'),
('Mercado de São Pedro', 'Marché traditionnel', 0, 'Rua de São Pedro, 9000-001 Funchal', '/images/activities/mercado-sao-pedro.jpg', 'gastronomie', 'madere', 'gratuit');

-- Gastronomie Madère - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('O Lagar', 'Restaurant traditionnelle', 15, 'Rua dos Aranhas 22, 9000-044 Funchal', '/images/activities/o-lagar.jpg', 'gastronomie', 'madere', 'budget'),
('A Bica', 'Restaurant local', 12, 'Rua da Carreira 119, 9000-042 Funchal', '/images/activities/a-bica.jpg', 'gastronomie', 'madere', 'budget'),
('O Polar', 'Restaurant de fruits de mer', 14, 'Rua da Carreira 116, 9000-042 Funchal', '/images/activities/o-polar.jpg', 'gastronomie', 'madere', 'budget'),
('O Portão', 'Restaurant traditionnelle', 10, 'Rua do Portão 5, 9000-001 Funchal', '/images/activities/o-portao.jpg', 'gastronomie', 'madere', 'budget'),
('O Lagar', 'Restaurant de quartier', 12, 'Rua dos Aranhas 22, 9000-044 Funchal', '/images/activities/o-lagar-2.jpg', 'gastronomie', 'madere', 'budget');

-- Gastronomie Madère - Moyen
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Armazém do Sal', 'Restaurant gastronomique', 55, 'Rua da Alfândega 135, 9000-059 Funchal', '/images/activities/armazem-sal.jpg', 'gastronomie', 'madere', 'moyen'),
('Kampo', 'Restaurant contemporain', 50, 'Rua do Dr. Fernão Ornelas 50, 9000-082 Funchal', '/images/activities/kampo.jpg', 'gastronomie', 'madere', 'moyen'),
('Doca do Cavacas', 'Restaurant de fruits de mer', 45, 'Estrada Monumental 284, 9000-100 Funchal', '/images/activities/doca-cavacas.jpg', 'gastronomie', 'madere', 'moyen'),
('Restaurante Mozart', 'Cuisine européenne', 60, 'Rua dos Aranhas 22, 9000-044 Funchal', '/images/activities/mozart.jpg', 'gastronomie', 'madere', 'moyen'),
('Restaurante Vila do Peixe', 'Restaurant de poissons', 40, 'Rua da Praia Formosa 1, 9000-100 Funchal', '/images/activities/vila-peixe.jpg', 'gastronomie', 'madere', 'moyen');

-- Gastronomie Madère - Premium
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('William', 'Restaurant gastronomique', 120, 'Rua dos Aranhas 22, 9000-044 Funchal', '/images/activities/william.jpg', 'gastronomie', 'madere', 'premium'),
('Il Gallo d''Oro', 'Restaurant 2 étoiles Michelin', 150, 'Estrada Monumental 147, 9000-100 Funchal', '/images/activities/gallo-oro.jpg', 'gastronomie', 'madere', 'premium'),
('Kampo by Chef Julio', 'Restaurant gastronomique', 130, 'Rua do Dr. Fernão Ornelas 50, 9000-082 Funchal', '/images/activities/kampo-julio.jpg', 'gastronomie', 'madere', 'premium'),
('Restaurante Vila do Peixe', 'Restaurant gastronomique', 140, 'Rua da Praia Formosa 1, 9000-100 Funchal', '/images/activities/vila-peixe-premium.jpg', 'gastronomie', 'madere', 'premium'),
('Restaurante Mozart', 'Restaurant gastronomique', 125, 'Rua dos Aranhas 22, 9000-044 Funchal', '/images/activities/mozart-premium.jpg', 'gastronomie', 'madere', 'premium');

-- Gastronomie Madère - Luxe
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Dîner au Monte Palace', 'Expérience gastronomique exclusive', 300, 'Caminho do Monte 174, 9050-288 Funchal', '/images/activities/monte-palace-diner.jpg', 'gastronomie', 'madere', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Funchal', '/images/activities/chef-madeira.jpg', 'gastronomie', 'madere', 'luxe'),
('Dégustation de Vins de Madère', 'Découverte des vins prestige', 250, 'Funchal', '/images/activities/vin-madeira.jpg', 'gastronomie', 'madere', 'luxe'),
('Cours de Cuisine Madérienne', 'Cours avec un chef étoilé', 350, 'Funchal', '/images/activities/cours-madeira.jpg', 'gastronomie', 'madere', 'luxe'),
('Luxury Food Tour', 'Tour gastronomique VIP', 400, 'Funchal', '/images/activities/food-tour-madeira.jpg', 'gastronomie', 'madere', 'luxe');

-- Gastronomie Bruxelles - Budget
INSERT INTO activities (title, description, price, address, imageurl, category, city, price_range) VALUES
('Chez Léon', 'Moules-frites traditionnelles', 15, 'Rue des Bouchers 18, 1000 Brussel', '/images/activities/leon.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Maison Antoine', 'Frites belges légendaires', 8, 'Place Jourdan 1, 1040 Etterbeek', '/images/activities/antoine.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Dandoy', 'Spécialités belges', 10, 'Rue au Beurre 31, 1000 Brussel', '/images/activities/dandoy.jpg', 'gastronomie', 'bruxelles', 'budget'),
('La Bécasse', 'Estaminet traditionnel', 12, 'Rue de Tabora 11, 1000 Brussel', '/images/activities/becasse.jpg', 'gastronomie', 'bruxelles', 'budget'),
('Le Roi des Belges', 'Cuisine belge traditionnelle', 14, 'Rue de Flandre 1, 1000 Brussel', '/images/activities/roi-belges.jpg', 'gastronomie', 'bruxelles', 'budget'); 