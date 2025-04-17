-- Supprime toutes les données existantes
DELETE FROM activities;

-- Insère les activités pour Paris
INSERT INTO activities (title, description, price, address, imageUrl, category, city, price_range) VALUES
-- Culture Paris - Gratuit
('Musée Carnavalet', 'Histoire de Paris à travers les siècles', 0, '23 Rue de Sévigné, 75003 Paris', '/images/activities/carnavalet.jpg', 'culture', 'paris', 'gratuit'),
('Jardin des Tuileries', 'Jardin à la française entre le Louvre et la Concorde', 0, 'Place de la Concorde, 75001 Paris', '/images/activities/tuileries.jpg', 'culture', 'paris', 'gratuit'),
('Église Saint-Sulpice', 'Église baroque avec fresques de Delacroix', 0, '2 Rue Palatine, 75006 Paris', '/images/activities/saint-sulpice.jpg', 'culture', 'paris', 'gratuit'),
('Bibliothèque Nationale', 'Bibliothèque historique de France', 0, '5 Rue Vivienne, 75002 Paris', '/images/activities/bnf.jpg', 'culture', 'paris', 'gratuit'),
('Cimetière du Père-Lachaise', 'Plus grand cimetière de Paris', 0, '16 Rue du Repos, 75020 Paris', '/images/activities/pere-lachaise.jpg', 'culture', 'paris', 'gratuit'),

-- Culture Paris - Budget
('Musée de la Vie Romantique', 'Musée dédié au romantisme', 12, '16 Rue Chaptal, 75009 Paris', '/images/activities/vie-romantique.jpg', 'culture', 'paris', 'budget'),
('Musée de Montmartre', 'Histoire du quartier des artistes', 15, '12 Rue Cortot, 75018 Paris', '/images/activities/montmartre.jpg', 'culture', 'paris', 'budget'),
('Musée de la Chasse', 'Collection d''art et d''objets de chasse', 12, '62 Rue des Archives, 75003 Paris', '/images/activities/chasse.jpg', 'culture', 'paris', 'budget'),
('Musée Nissim de Camondo', 'Hôtel particulier art déco', 14, '63 Rue de Monceau, 75008 Paris', '/images/activities/camondo.jpg', 'culture', 'paris', 'budget'),
('Musée de la Musique', 'Collection d''instruments de musique', 15, '221 Avenue Jean-Jaurès, 75019 Paris', '/images/activities/musique.jpg', 'culture', 'paris', 'budget'),

-- Culture Paris - Moyen
('Musée d''Orsay', 'Collection impressionniste dans une ancienne gare', 16, '1 Rue de la Légion d''Honneur, 75007 Paris', '/images/activities/orsay.jpg', 'culture', 'paris', 'moyen'),
('Centre Pompidou', 'Art moderne et contemporain', 14, 'Place Georges-Pompidou, 75004 Paris', '/images/activities/pompidou.jpg', 'culture', 'paris', 'moyen'),
('Musée de l''Orangerie', 'Les Nymphéas de Monet', 12, 'Jardin des Tuileries, 75001 Paris', '/images/activities/orangerie.jpg', 'culture', 'paris', 'moyen'),
('Musée Rodin', 'Sculptures dans un hôtel particulier', 13, '79 Rue de Varenne, 75007 Paris', '/images/activities/rodin.jpg', 'culture', 'paris', 'moyen'),
('Musée Picasso', 'Collection d''œuvres de Pablo Picasso', 14, '5 Rue de Thorigny, 75003 Paris', '/images/activities/picasso.jpg', 'culture', 'paris', 'moyen'),

-- Culture Paris - Premium
('Musée du Louvre', 'Le plus grand musée d''art au monde', 17, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre.jpg', 'culture', 'paris', 'premium'),
('Palais de Versailles', 'Château et jardins du Roi Soleil', 27, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles.jpg', 'culture', 'paris', 'premium'),
('Opéra Garnier', 'Visite guidée du palais Garnier', 25, '8 Rue Scribe, 75009 Paris', '/images/activities/opera.jpg', 'culture', 'paris', 'premium'),
('Château de Fontainebleau', 'Résidence royale historique', 15, '77300 Fontainebleau', '/images/activities/fontainebleau.jpg', 'culture', 'paris', 'premium'),
('Musée des Arts Décoratifs', 'Art décoratif et design', 14, '107 Rue de Rivoli, 75001 Paris', '/images/activities/arts-deco.jpg', 'culture', 'paris', 'premium'),

-- Culture Paris - Luxe
('Visite Privée du Louvre', 'Visite exclusive du musée', 200, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre-prive.jpg', 'culture', 'paris', 'luxe'),
('Soirée à Versailles', 'Dîner et visite privée', 300, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles-soiree.jpg', 'culture', 'paris', 'luxe'),
('Vol en Hélicoptère', 'Survol des châteaux d''Île-de-France', 400, 'Héliport de Paris, 75015 Paris', '/images/activities/helico-culture.jpg', 'culture', 'paris', 'luxe'),
('Opéra VIP', 'Soirée privée à l''Opéra Garnier', 500, '8 Rue Scribe, 75009 Paris', '/images/activities/opera-vip.jpg', 'culture', 'paris', 'luxe'),
('Week-end Culturel', 'Expérience culturelle exclusive', 1000, 'Paris', '/images/activities/weekend-culture.jpg', 'culture', 'paris', 'luxe'),

-- Gastronomie Paris - Gratuit
('Marché d''Aligre', 'Marché traditionnel parisien', 0, 'Place d''Aligre, 75012 Paris', '/images/activities/aligre.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché des Enfants Rouges', 'Plus vieux marché couvert de Paris', 0, '39 Rue de Bretagne, 75003 Paris', '/images/activities/enfants-rouges.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Bastille', 'Grand marché alimentaire', 0, 'Place de la Bastille, 75011 Paris', '/images/activities/marche-bastille.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Mouffetard', 'Rue commerçante historique', 0, 'Rue Mouffetard, 75005 Paris', '/images/activities/mouffetard.jpg', 'gastronomie', 'paris', 'gratuit'),
('Marché Saxe-Breteuil', 'Vue sur la Tour Eiffel', 0, 'Avenue de Saxe, 75007 Paris', '/images/activities/saxe-breteuil.jpg', 'gastronomie', 'paris', 'gratuit'),

-- Gastronomie Paris - Budget
('L''As du Fallafel', 'Meilleurs falafels de Paris', 8, '34 Rue des Rosiers, 75004 Paris', '/images/activities/fallafel.jpg', 'gastronomie', 'paris', 'budget'),
('Bouillon Chartier', 'Restaurant historique parisien', 15, '7 Rue du Faubourg Montmartre, 75009 Paris', '/images/activities/chartier.jpg', 'gastronomie', 'paris', 'budget'),
('Le Petit Vendôme', 'Sandwicherie traditionnelle', 10, '8 Rue des Capucines, 75002 Paris', '/images/activities/vendome.jpg', 'gastronomie', 'paris', 'budget'),
('L''Avant Comptoir', 'Bar à vins et tapas', 15, '3 Carrefour de l''Odéon, 75006 Paris', '/images/activities/avant-comptoir.jpg', 'gastronomie', 'paris', 'budget'),
('Le Baron Rouge', 'Bar à vin traditionnel', 12, '1 Rue Théophile Roussel, 75012 Paris', '/images/activities/baron-rouge.jpg', 'gastronomie', 'paris', 'budget'),

-- Gastronomie Paris - Moyen
('Le Baratin', 'Bistrot gastronomique', 55, '3 Rue Jouye-Rouve, 75020 Paris', '/images/activities/baratin.jpg', 'gastronomie', 'paris', 'moyen'),
('Le Chateaubriand', 'Restaurant néo-bistrot', 95, '129 Avenue Parmentier, 75011 Paris', '/images/activities/chateaubriand.jpg', 'gastronomie', 'paris', 'moyen'),
('Le Comptoir du Relais', 'Bistrot gastronomique', 45, '9 Carrefour de l''Odéon, 75006 Paris', '/images/activities/comptoir.jpg', 'gastronomie', 'paris', 'moyen'),
('Bistrot Paul Bert', 'Cuisine française traditionnelle', 50, '18 Rue Paul Bert, 75011 Paris', '/images/activities/paul-bert.jpg', 'gastronomie', 'paris', 'moyen'),
('Clamato', 'Restaurant de fruits de mer', 60, '80 Rue de Charonne, 75011 Paris', '/images/activities/clamato.jpg', 'gastronomie', 'paris', 'moyen'),

-- Gastronomie Paris - Premium
('L''Arpège', 'Restaurant 3 étoiles Michelin', 175, '84 Rue de Varenne, 75007 Paris', '/images/activities/arpege.jpg', 'gastronomie', 'paris', 'premium'),
('Le Bristol', 'Restaurant gastronomique', 180, '112 Rue du Faubourg Saint-Honoré, 75008 Paris', '/images/activities/bristol.jpg', 'gastronomie', 'paris', 'premium'),
('L''Abeille', 'Restaurant 2 étoiles Michelin', 165, '10 Avenue d''Iéna, 75116 Paris', '/images/activities/abeille.jpg', 'gastronomie', 'paris', 'premium'),
('Le Cinq', 'Restaurant gastronomique', 195, '31 Avenue George V, 75008 Paris', '/images/activities/cinq.jpg', 'gastronomie', 'paris', 'premium'),
('Guy Savoy', 'Restaurant 3 étoiles Michelin', 170, 'Monnaie de Paris, 75006 Paris', '/images/activities/guy-savoy.jpg', 'gastronomie', 'paris', 'premium'),

-- Gastronomie Paris - Luxe
('Dîner sur la Tour Eiffel', 'Expérience gastronomique unique', 300, 'Champ de Mars, 75007 Paris', '/images/activities/tour-eiffel-diner.jpg', 'gastronomie', 'paris', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Paris', '/images/activities/chef-domicile.jpg', 'gastronomie', 'paris', 'luxe'),
('Dîner Croisière VIP', 'Dîner gastronomique sur la Seine', 400, 'Port de la Conférence, 75008 Paris', '/images/activities/croisiere-vip.jpg', 'gastronomie', 'paris', 'luxe'),
('Cours de Cuisine Privé', 'Cours avec un chef étoilé', 350, 'Paris', '/images/activities/cours-cuisine.jpg', 'gastronomie', 'paris', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques parisiennes', 250, 'Paris', '/images/activities/degustation-luxe.jpg', 'gastronomie', 'paris', 'luxe');

-- Culture Lyon - Gratuit
('Place Bellecour', 'Plus grande place piétonne d''Europe', 0, 'Place Bellecour, 69002 Lyon', '/images/activities/bellecour.jpg', 'culture', 'lyon', 'gratuit'),
('Traboules du Vieux Lyon', 'Passages historiques secrets', 0, 'Vieux Lyon, 69005 Lyon', '/images/activities/traboules.jpg', 'culture', 'lyon', 'gratuit'),
('Parc de la Tête d''Or', 'Plus grand parc urbain de France', 0, 'Boulevard de Stalingrad, 69006 Lyon', '/images/activities/tete-or.jpg', 'culture', 'lyon', 'gratuit'),
('Basilique de Fourvière', 'Église néo-byzantine', 0, '8 Place de Fourvière, 69005 Lyon', '/images/activities/fourviere.jpg', 'culture', 'lyon', 'gratuit'),
('Quais de Saône', 'Promenade historique', 0, 'Quais de Saône, 69005 Lyon', '/images/activities/quais-saone.jpg', 'culture', 'lyon', 'gratuit'),

-- Culture Lyon - Budget
('Musée des Beaux-Arts', 'Collection d''art classique', 12, '20 Place des Terreaux, 69001 Lyon', '/images/activities/beaux-arts.jpg', 'culture', 'lyon', 'budget'),
('Musée des Confluences', 'Musée des sciences', 15, '86 Quai Perrache, 69002 Lyon', '/images/activities/confluences.jpg', 'culture', 'lyon', 'budget'),
('Musée Gadagne', 'Histoire de Lyon', 10, '1 Place du Petit Collège, 69005 Lyon', '/images/activities/gadagne.jpg', 'culture', 'lyon', 'budget'),
('Musée de l''Imprimerie', 'Histoire de l''imprimerie', 12, '13 Rue de la Poulaillerie, 69002 Lyon', '/images/activities/imprimerie.jpg', 'culture', 'lyon', 'budget'),
('Musée des Tissus', 'Art textile et mode', 14, '34 Rue de la Charité, 69002 Lyon', '/images/activities/tissus.jpg', 'culture', 'lyon', 'budget'),

-- Culture Lyon - Moyen
('Opéra de Lyon', 'Spectacle lyrique', 45, '1 Place de la Comédie, 69001 Lyon', '/images/activities/opera-lyon.jpg', 'culture', 'lyon', 'moyen'),
('Théâtre des Célestins', 'Théâtre historique', 35, '4 Rue Charles Dullin, 69002 Lyon', '/images/activities/celestins.jpg', 'culture', 'lyon', 'moyen'),
('Auditorium', 'Salle de concert', 40, 'Rue de Bonnel, 69003 Lyon', '/images/activities/auditorium.jpg', 'culture', 'lyon', 'moyen'),
('Maison de la Danse', 'Spectacle de danse', 30, '8 Avenue Jean Mermoz, 69008 Lyon', '/images/activities/maison-danse.jpg', 'culture', 'lyon', 'moyen'),
('Théâtre de la Croix-Rousse', 'Théâtre contemporain', 25, 'Place Joannès Ambre, 69004 Lyon', '/images/activities/croix-rousse.jpg', 'culture', 'lyon', 'moyen'),

-- Culture Lyon - Premium
('Biennale de la Danse', 'Festival international', 60, 'Lyon', '/images/activities/biennale-danse.jpg', 'culture', 'lyon', 'premium'),
('Festival Lumière', 'Festival du cinéma', 50, 'Lyon', '/images/activities/festival-lumiere.jpg', 'culture', 'lyon', 'premium'),
('Nuits de Fourvière', 'Festival pluridisciplinaire', 55, '6 Rue de l''Antiquaille, 69005 Lyon', '/images/activities/nuits-fourviere.jpg', 'culture', 'lyon', 'premium'),
('Festival Jazz à Vienne', 'Festival de jazz', 45, 'Vienne', '/images/activities/jazz-vienne.jpg', 'culture', 'lyon', 'premium'),
('Festival Les Nuits Sonores', 'Festival de musique électronique', 65, 'Lyon', '/images/activities/nuits-sonores.jpg', 'culture', 'lyon', 'premium'),

-- Culture Lyon - Luxe
('Visite Privée de Fourvière', 'Accès exclusif à la basilique', 200, '8 Place de Fourvière, 69005 Lyon', '/images/activities/fourviere-prive.jpg', 'culture', 'lyon', 'luxe'),
('Dîner à l''Opéra', 'Expérience gastronomique et culturelle', 300, '1 Place de la Comédie, 69001 Lyon', '/images/activities/opera-diner.jpg', 'culture', 'lyon', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 500, 'Lyon', '/images/activities/weekend-lyon.jpg', 'culture', 'lyon', 'luxe'),
('Soirée Privée aux Célestins', 'Spectacle privé', 400, '4 Rue Charles Dullin, 69002 Lyon', '/images/activities/celestins-prive.jpg', 'culture', 'lyon', 'luxe'),
('Expérience Lumière Exclusive', 'Tour privé des installations', 350, 'Lyon', '/images/activities/lumiere-exclusive.jpg', 'culture', 'lyon', 'luxe');

-- Culture Marseille - Gratuit
('Vieux-Port', 'Port historique de Marseille', 0, 'Vieux-Port, 13001 Marseille', '/images/activities/vieux-port.jpg', 'culture', 'marseille', 'gratuit'),
('Notre-Dame de la Garde', 'Basilique emblématique surplombant la ville', 0, 'Rue Fort du Sanctuaire, 13006 Marseille', '/images/activities/notre-dame-garde.jpg', 'culture', 'marseille', 'gratuit'),
('Quartier du Panier', 'Plus vieux quartier de Marseille', 0, 'Le Panier, 13002 Marseille', '/images/activities/panier.jpg', 'culture', 'marseille', 'gratuit'),
('Corniche Kennedy', 'Promenade maritime panoramique', 0, 'Corniche Kennedy, 13007 Marseille', '/images/activities/corniche.jpg', 'culture', 'marseille', 'gratuit'),
('Place aux Huiles', 'Place historique du Vieux-Port', 0, 'Place aux Huiles, 13001 Marseille', '/images/activities/place-huiles.jpg', 'culture', 'marseille', 'gratuit'),

-- Culture Marseille - Budget
('MuCEM', 'Musée des civilisations de l''Europe et de la Méditerranée', 12, '1 Esplanade du J4, 13002 Marseille', '/images/activities/mucem.jpg', 'culture', 'marseille', 'budget'),
('Musée d''Histoire de Marseille', 'Histoire de la plus ancienne ville de France', 10, '2 Rue Henri Barbusse, 13001 Marseille', '/images/activities/histoire-marseille.jpg', 'culture', 'marseille', 'budget'),
('Villa Méditerranée', 'Centre de rencontres et d''expositions', 8, 'Esplanade du J4, 13002 Marseille', '/images/activities/villa-med.jpg', 'culture', 'marseille', 'budget'),
('Fondation Regards de Provence', 'Art contemporain provençal', 10, 'Allée Regards de Provence, 13002 Marseille', '/images/activities/regards-provence.jpg', 'culture', 'marseille', 'budget'),
('Musée des Arts Africains', 'Collection d''art africain', 8, '2 Rue de la Charité, 13002 Marseille', '/images/activities/arts-africains.jpg', 'culture', 'marseille', 'budget'),

-- Culture Marseille - Moyen
('Opéra de Marseille', 'Spectacle lyrique', 40, '2 Rue Molière, 13001 Marseille', '/images/activities/opera-marseille.jpg', 'culture', 'marseille', 'moyen'),
('Théâtre du Gymnase', 'Théâtre historique', 35, '4 Rue du Théâtre Français, 13001 Marseille', '/images/activities/gymnase.jpg', 'culture', 'marseille', 'moyen'),
('Palais des Arts', 'Centre culturel et artistique', 30, '1 Place Carli, 13001 Marseille', '/images/activities/palais-arts.jpg', 'culture', 'marseille', 'moyen'),
('Théâtre National de Marseille', 'Scène contemporaine', 25, '20 Quai de Rive Neuve, 13007 Marseille', '/images/activities/theatre-national.jpg', 'culture', 'marseille', 'moyen'),
('Espace Julien', 'Salle de spectacles alternative', 20, '39 Cours Julien, 13006 Marseille', '/images/activities/espace-julien.jpg', 'culture', 'marseille', 'moyen'),

-- Culture Marseille - Premium
('Festival de Marseille', 'Festival pluridisciplinaire', 55, 'Marseille', '/images/activities/festival-marseille.jpg', 'culture', 'marseille', 'premium'),
('Festival Jazz des Cinq Continents', 'Festival de jazz international', 45, 'Marseille', '/images/activities/jazz-continents.jpg', 'culture', 'marseille', 'premium'),
('Festival Actoral', 'Festival d''art contemporain', 50, 'Marseille', '/images/activities/actoral.jpg', 'culture', 'marseille', 'premium'),
('Festival Mars en Baroque', 'Festival de musique baroque', 40, 'Marseille', '/images/activities/mars-baroque.jpg', 'culture', 'marseille', 'premium'),
('Festival Babel Med Music', 'Festival de musiques du monde', 35, 'Marseille', '/images/activities/babel-med.jpg', 'culture', 'marseille', 'premium'),

-- Culture Marseille - Luxe
('Visite Privée du MuCEM', 'Accès exclusif au musée', 200, '1 Esplanade du J4, 13002 Marseille', '/images/activities/mucem-prive.jpg', 'culture', 'marseille', 'luxe'),
('Dîner à Notre-Dame de la Garde', 'Expérience gastronomique avec vue', 300, 'Rue Fort du Sanctuaire, 13006 Marseille', '/images/activities/notre-dame-diner.jpg', 'culture', 'marseille', 'luxe'),
('Week-end Culturel VIP', 'Expérience culturelle exclusive', 500, 'Marseille', '/images/activities/weekend-marseille.jpg', 'culture', 'marseille', 'luxe'),
('Croisière Culturelle Privée', 'Tour des calanques en yacht', 400, 'Vieux-Port, 13001 Marseille', '/images/activities/croisiere-culture.jpg', 'culture', 'marseille', 'luxe'),
('Soirée Privée au Palais des Arts', 'Spectacle privé', 350, '1 Place Carli, 13001 Marseille', '/images/activities/palais-prive.jpg', 'culture', 'marseille', 'luxe');

-- Gastronomie Marseille - Gratuit
('Marché des Capucins', 'Plus grand marché de Marseille', 0, 'Place des Capucins, 13001 Marseille', '/images/activities/capucins.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché du Prado', 'Marché provençal traditionnel', 0, 'Avenue du Prado, 13008 Marseille', '/images/activities/prado.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché de la Plaine', 'Marché bio et artisanal', 0, 'Place Jean Jaurès, 13001 Marseille', '/images/activities/plaine.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché de Noailles', 'Marché aux épices et produits exotiques', 0, 'Rue du Marché des Capucins, 13001 Marseille', '/images/activities/noailles.jpg', 'gastronomie', 'marseille', 'gratuit'),
('Marché des Quais', 'Marché de poissons frais', 0, 'Quai des Belges, 13002 Marseille', '/images/activities/quais.jpg', 'gastronomie', 'marseille', 'gratuit'),

-- Gastronomie Marseille - Budget
('Chez Etienne', 'Pizza traditionnelle marseillaise', 12, '43 Rue de Lorette, 13002 Marseille', '/images/activities/etienne.jpg', 'gastronomie', 'marseille', 'budget'),
('L''Epuisette', 'Restaurant de poissons', 15, '156 Rue du Vallon des Auffes, 13007 Marseille', '/images/activities/epuisette.jpg', 'gastronomie', 'marseille', 'budget'),
('Le Miramar', 'Bouillabaisse traditionnelle', 18, '12 Quai du Port, 13002 Marseille', '/images/activities/miramar.jpg', 'gastronomie', 'marseille', 'budget'),
('La Caravelle', 'Bar à tapas provençales', 15, '34 Quai du Port, 13002 Marseille', '/images/activities/caravelle.jpg', 'gastronomie', 'marseille', 'budget'),
('Le Petit Nice', 'Restaurant de fruits de mer', 20, '17 Rue des Braves, 13007 Marseille', '/images/activities/petit-nice.jpg', 'gastronomie', 'marseille', 'budget'),

-- Gastronomie Marseille - Moyen
('Le Château', 'Restaurant gastronomique provençal', 45, '8 Rue du Commandant André, 13008 Marseille', '/images/activities/chateau.jpg', 'gastronomie', 'marseille', 'moyen'),
('La Table d''Augustine', 'Cuisine méditerranéenne', 55, '35 Rue du Commandant André, 13008 Marseille', '/images/activities/augustine.jpg', 'gastronomie', 'marseille', 'moyen'),
('Le Malthazar', 'Restaurant bistronomique', 50, '19 Rue Fortia, 13001 Marseille', '/images/activities/malthazar.jpg', 'gastronomie', 'marseille', 'moyen'),
('La Coquille', 'Restaurant de fruits de mer', 60, '2 Rue du Théâtre Français, 13001 Marseille', '/images/activities/coquille.jpg', 'gastronomie', 'marseille', 'moyen'),
('Le Bistrot d''Edouard', 'Cuisine du marché', 40, '10 Rue d''Aubagne, 13001 Marseille', '/images/activities/edouard.jpg', 'gastronomie', 'marseille', 'moyen'),

-- Gastronomie Marseille - Premium
('Le Petit Nice', 'Restaurant 3 étoiles Michelin', 165, '17 Rue des Braves, 13007 Marseille', '/images/activities/petit-nice-premium.jpg', 'gastronomie', 'marseille', 'premium'),
('AM par Alexandre Mazzia', 'Restaurant 3 étoiles Michelin', 195, '9 Rue des Trois Rois, 13006 Marseille', '/images/activities/mazzia.jpg', 'gastronomie', 'marseille', 'premium'),
('La Table du Fort', 'Restaurant gastronomique', 145, '8 Boulevard Charles Livon, 13007 Marseille', '/images/activities/fort.jpg', 'gastronomie', 'marseille', 'premium'),
('L''Epuisette', 'Restaurant gastronomique', 155, '156 Rue du Vallon des Auffes, 13007 Marseille', '/images/activities/epuisette-premium.jpg', 'gastronomie', 'marseille', 'premium'),
('Le Miramar', 'Restaurant gastronomique', 175, '12 Quai du Port, 13002 Marseille', '/images/activities/miramar-premium.jpg', 'gastronomie', 'marseille', 'premium'),

-- Gastronomie Marseille - Luxe
('Dîner sur la Corniche', 'Expérience gastronomique avec vue', 300, 'Corniche Kennedy, 13007 Marseille', '/images/activities/corniche-diner.jpg', 'gastronomie', 'marseille', 'luxe'),
('Chef à Domicile', 'Chef étoilé à domicile', 500, 'Marseille', '/images/activities/chef-marseille.jpg', 'gastronomie', 'marseille', 'luxe'),
('Dîner Croisière VIP', 'Dîner gastronomique en mer', 400, 'Vieux-Port, 13001 Marseille', '/images/activities/croisiere-gastro.jpg', 'gastronomie', 'marseille', 'luxe'),
('Cours de Cuisine Méditerranéenne', 'Cours avec un chef étoilé', 350, 'Marseille', '/images/activities/cours-med.jpg', 'gastronomie', 'marseille', 'luxe'),
('Dégustation de Vins Prestige', 'Caves historiques marseillaises', 250, 'Marseille', '/images/activities/degustation-marseille.jpg', 'gastronomie', 'marseille', 'luxe');

-- Ajoute d'autres activités ici 