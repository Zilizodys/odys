-- Vérification de la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'activities';

-- Création d'une table temporaire pour la sauvegarde
CREATE TABLE IF NOT EXISTS activities_backup AS 
SELECT * FROM activities;

-- Suppression des données existantes
DELETE FROM activities;

-- Insertion des nouvelles activités
INSERT INTO activities (title, description, price, address, imageUrl, category, city) VALUES
-- Culture Paris - Gratuit
('Musée Carnavalet', 'Histoire de Paris à travers les siècles', 0, '23 Rue de Sévigné, 75003 Paris', '/images/activities/carnavalet.jpg', 'culture', 'paris'),
('Jardin des Tuileries', 'Jardin à la française entre le Louvre et la Concorde', 0, 'Place de la Concorde, 75001 Paris', '/images/activities/tuileries.jpg', 'culture', 'paris'),
('Église Saint-Sulpice', 'Église baroque avec fresques de Delacroix', 0, '2 Rue Palatine, 75006 Paris', '/images/activities/saint-sulpice.jpg', 'culture', 'paris'),
('Bibliothèque Nationale', 'Bibliothèque historique avec salle de lecture', 0, '5 Rue Vivienne, 75002 Paris', '/images/activities/bnf.jpg', 'culture', 'paris'),
('Cimetière du Père-Lachaise', 'Plus grand cimetière de Paris avec tombes célèbres', 0, '16 Rue du Repos, 75020 Paris', '/images/activities/pere-lachaise.jpg', 'culture', 'paris'),

-- Culture Paris - Budget
('Musée de la Vie Romantique', 'Musée dédié au romantisme', 12, '16 Rue Chaptal, 75009 Paris', '/images/activities/vie-romantique.jpg', 'culture', 'paris'),
('Musée de Montmartre', 'Histoire du quartier des artistes', 15, '12 Rue Cortot, 75018 Paris', '/images/activities/montmartre.jpg', 'culture', 'paris'),
('Musée de la Chasse', 'Collection d''art et d''objets de chasse', 12, '62 Rue des Archives, 75003 Paris', '/images/activities/chasse.jpg', 'culture', 'paris'),
('Musée Nissim de Camondo', 'Hôtel particulier art déco', 14, '63 Rue de Monceau, 75008 Paris', '/images/activities/camondo.jpg', 'culture', 'paris'),
('Musée de la Musique', 'Collection d''instruments de musique', 15, '221 Avenue Jean-Jaurès, 75019 Paris', '/images/activities/musique.jpg', 'culture', 'paris'),

-- Culture Paris - Moyen
('Musée d''Orsay', 'Collection impressionniste dans une ancienne gare', 16, '1 Rue de la Légion d''Honneur, 75007 Paris', '/images/activities/orsay.jpg', 'culture', 'paris'),
('Centre Pompidou', 'Art moderne et contemporain', 14, 'Place Georges-Pompidou, 75004 Paris', '/images/activities/pompidou.jpg', 'culture', 'paris'),
('Musée de l''Orangerie', 'Les Nymphéas de Monet', 12, 'Jardin des Tuileries, 75001 Paris', '/images/activities/orangerie.jpg', 'culture', 'paris'),
('Musée Rodin', 'Collection de sculptures dans un hôtel particulier', 13, '77 Rue de Varenne, 75007 Paris', '/images/activities/rodin.jpg', 'culture', 'paris'),
('Musée Picasso', 'Collection d''œuvres de Pablo Picasso', 14, '5 Rue de Thorigny, 75003 Paris', '/images/activities/picasso.jpg', 'culture', 'paris'),

-- Culture Paris - Premium
('Musée du Louvre', 'Le plus grand musée d''art au monde', 17, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre.jpg', 'culture', 'paris'),
('Palais de Versailles', 'Château et jardins du Roi-Soleil', 27, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles.jpg', 'culture', 'paris'),
('Opéra Garnier', 'Visite guidée du palais de l''Opéra', 25, '8 Rue Scribe, 75009 Paris', '/images/activities/opera.jpg', 'culture', 'paris'),
('Château de Fontainebleau', 'Résidence royale historique', 15, '77300 Fontainebleau', '/images/activities/fontainebleau.jpg', 'culture', 'paris'),
('Musée des Arts Décoratifs', 'Art décoratif et design', 14, '107 Rue de Rivoli, 75001 Paris', '/images/activities/arts-deco.jpg', 'culture', 'paris'),

-- Culture Paris - Luxe
('Visite Privée du Louvre', 'Visite exclusive avec guide conférencier', 150, 'Rue de Rivoli, 75001 Paris', '/images/activities/louvre-prive.jpg', 'culture', 'paris'),
('Dîner au Château de Versailles', 'Expérience gastronomique dans un cadre historique', 200, 'Place d''Armes, 78000 Versailles', '/images/activities/versailles-diner.jpg', 'culture', 'paris'),
('Balade en Hélicoptère', 'Tour de Paris vue du ciel', 250, 'Aéroport de Paris-Le Bourget', '/images/activities/helico.jpg', 'culture', 'paris'),
('Soirée à l''Opéra Garnier', 'Spectacle et dîner gastronomique', 300, '8 Rue Scribe, 75009 Paris', '/images/activities/opera-soiree.jpg', 'culture', 'paris'),
('Week-end au Château', 'Séjour dans un château historique', 500, 'Château de la région parisienne', '/images/activities/chateau-weekend.jpg', 'culture', 'paris'),

-- Gastronomie Paris - Gratuit
('Marché des Enfants Rouges', 'Plus vieux marché couvert de Paris', 0, '39 Rue de Bretagne, 75003 Paris', '/images/activities/enfants-rouges.jpg', 'gastronomie', 'paris'),
('Marché d''Aligre', 'Marché populaire et authentique', 0, 'Place d''Aligre, 75012 Paris', '/images/activities/aligre.jpg', 'gastronomie', 'paris'),
('Marché Saint-Germain', 'Marché couvert historique', 0, '4-6 Rue Lobineau, 75006 Paris', '/images/activities/saint-germain.jpg', 'gastronomie', 'paris'),
('Marché de Belleville', 'Marché multiculturel', 0, 'Boulevard de Belleville, 75020 Paris', '/images/activities/belleville.jpg', 'gastronomie', 'paris'),
('Marché de la Porte de Vanves', 'Marché aux puces et brocante', 0, 'Avenue Georges Lafenestre, 75014 Paris', '/images/activities/vanves.jpg', 'gastronomie', 'paris'),

-- Gastronomie Paris - Budget
('L''As du Fallafel', 'Meilleurs falafels de Paris', 8, '34 Rue des Rosiers, 75004 Paris', '/images/activities/fallafel.jpg', 'gastronomie', 'paris'),
('Chez Marianne', 'Cuisine juive traditionnelle', 12, '2 Rue des Hospitalières-Saint-Gervais, 75004 Paris', '/images/activities/marianne.jpg', 'gastronomie', 'paris'),
('Le Petit Vendôme', 'Sandwichs gastronomiques', 10, '8 Rue des Capucines, 75001 Paris', '/images/activities/vendome.jpg', 'gastronomie', 'paris'),
('Breizh Café', 'Crêpes bretonnes authentiques', 15, '109 Rue Vieille du Temple, 75003 Paris', '/images/activities/breizh.jpg', 'gastronomie', 'paris'),
('L''Avant Comptoir', 'Petites assiettes et vins', 15, '9 Carrefour de l''Odéon, 75006 Paris', '/images/activities/avant-comptoir.jpg', 'gastronomie', 'paris'),

-- Gastronomie Paris - Moyen
('Le Baratin', 'Cuisine du marché créative', 55, '3 Rue Jouye-Rouve, 75020 Paris', '/images/activities/baratin.jpg', 'gastronomie', 'paris'),
('Le Chateaubriand', 'Cuisine moderne et créative', 95, '129 Avenue Parmentier, 75011 Paris', '/images/activities/chateaubriand.jpg', 'gastronomie', 'paris'),
('Le Comptoir du Relais', 'Bistrot parisien traditionnel', 45, '9 Carrefour de l''Odéon, 75006 Paris', '/images/activities/comptoir-relais.jpg', 'gastronomie', 'paris'),
('Le Dauphin', 'Petites assiettes et vins nature', 50, '131 Avenue Parmentier, 75011 Paris', '/images/activities/dauphin.jpg', 'gastronomie', 'paris'),
('Le Verre Volé', 'Cuisine bistrot et vins nature', 45, '67 Rue de Lancry, 75010 Paris', '/images/activities/verre-vole.jpg', 'gastronomie', 'paris'),

-- Gastronomie Paris - Premium
('L''Arpège', 'Restaurant 3 étoiles Michelin', 175, '84 Rue de Varenne, 75007 Paris', '/images/activities/arpege.jpg', 'gastronomie', 'paris'),
('Le Bristol', 'Restaurant gastronomique 3 étoiles', 180, '112 Rue du Faubourg Saint-Honoré, 75008 Paris', '/images/activities/bristol.jpg', 'gastronomie', 'paris'),
('Guy Savoy', 'Cuisine gastronomique 3 étoiles', 190, '11 Quai de Conti, 75006 Paris', '/images/activities/guy-savoy.jpg', 'gastronomie', 'paris'),
('L''Abeille', 'Cuisine raffinée 2 étoiles', 165, '10 Avenue d''Iéna, 75016 Paris', '/images/activities/abeille.jpg', 'gastronomie', 'paris'),
('Le Cinq', 'Restaurant gastronomique 3 étoiles', 195, '31 Avenue George V, 75008 Paris', '/images/activities/cinq.jpg', 'gastronomie', 'paris'),

-- Gastronomie Paris - Luxe
('Expérience Privée chez L''Arpège', 'Menu dégustation privé avec le chef', 350, '84 Rue de Varenne, 75007 Paris', '/images/activities/arpege-prive.jpg', 'gastronomie', 'paris'),
('Dîner sur la Tour Eiffel', 'Restaurant gastronomique avec vue panoramique', 400, 'Champ de Mars, 75007 Paris', '/images/activities/eiffel-diner.jpg', 'gastronomie', 'paris'),
('Soirée Gastronomique au Château', 'Dîner privé dans un château', 450, 'Château de la région parisienne', '/images/activities/chateau-diner.jpg', 'gastronomie', 'paris'),
('Expérience Culinaria', 'Menu dégustation avec accord mets-vins', 500, 'Restaurant gastronomique parisien', '/images/activities/culinaria.jpg', 'gastronomie', 'paris'),
('Week-end Gastronomique', 'Séjour gastronomique complet', 1000, 'Hôtel de luxe parisien', '/images/activities/weekend-gastro.jpg', 'gastronomie', 'paris'),

-- Vie Nocturne Paris - Gratuit
('Place de la République', 'Place animée avec artistes de rue', 0, 'Place de la République, 75003 Paris', '/images/activities/republique.jpg', 'vie_nocturne', 'paris'),
('Quai de Seine', 'Balade nocturne le long de la Seine', 0, 'Quai de Seine, 75001 Paris', '/images/activities/quai-seine.jpg', 'vie_nocturne', 'paris'),
('Place des Vosges', 'Place historique illuminée', 0, 'Place des Vosges, 75004 Paris', '/images/activities/vosges.jpg', 'vie_nocturne', 'paris'),
('Montmartre la Nuit', 'Quartier des artistes illuminé', 0, 'Montmartre, 75018 Paris', '/images/activities/montmartre-nuit.jpg', 'vie_nocturne', 'paris'),
('Tour Eiffel Illuminée', 'Spectacle lumineux gratuit', 0, 'Champ de Mars, 75007 Paris', '/images/activities/eiffel-illuminee.jpg', 'vie_nocturne', 'paris'),

-- Vie Nocturne Paris - Budget
('Le Comptoir Général', 'Bar caché avec ambiance coloniale', 12, '80 Quai de Jemmapes, 75010 Paris', '/images/activities/comptoir-general.jpg', 'vie_nocturne', 'paris'),
('Le Perchoir Marais', 'Rooftop bar avec vue panoramique', 15, '33 Rue de la Verrerie, 75004 Paris', '/images/activities/perchoir.jpg', 'vie_nocturne', 'paris'),
('La Bellevilloise', 'Club culturel avec concerts', 20, '19-21 Rue Boyer, 75020 Paris', '/images/activities/bellevilloise.jpg', 'vie_nocturne', 'paris'),
('Le Baron Rouge', 'Bar à vin traditionnel', 8, '1 Rue Théophile Roussel, 75012 Paris', '/images/activities/baron-rouge.jpg', 'vie_nocturne', 'paris'),
('Experimental Cocktail Club', 'Bar à cocktails sophistiqué', 14, '37 Rue Saint-Sauveur, 75002 Paris', '/images/activities/ecc.jpg', 'vie_nocturne', 'paris'),

-- Vie Nocturne Paris - Moyen
('Rex Club', 'Club emblématique de la scène électro', 20, '5 Boulevard Poissonnière, 75002 Paris', '/images/activities/rex.jpg', 'vie_nocturne', 'paris'),
('Showcase', 'Club sous les arches du Pont Alexandre III', 25, 'Port des Champs-Élysées, 75008 Paris', '/images/activities/showcase.jpg', 'vie_nocturne', 'paris'),
('Nouveau Casino', 'Salle de concert alternative', 30, '109 Rue Oberkampf, 75011 Paris', '/images/activities/nouveau-casino.jpg', 'vie_nocturne', 'paris'),
('La Machine du Moulin Rouge', 'Club dans un ancien moulin', 25, '90 Boulevard de Clichy, 75018 Paris', '/images/activities/machine.jpg', 'vie_nocturne', 'paris'),
('Le Silencio', 'Club privé design', 35, '142 Rue Montmartre, 75002 Paris', '/images/activities/silencio.jpg', 'vie_nocturne', 'paris'),

-- Vie Nocturne Paris - Premium
('L''Arc Paris', 'Club VIP sous l''Arc de Triomphe', 50, '12 Avenue des Champs-Élysées, 75008 Paris', '/images/activities/arc.jpg', 'vie_nocturne', 'paris'),
('VIP Room', 'Club exclusif des Champs-Élysées', 60, '76 Avenue des Champs-Élysées, 75008 Paris', '/images/activities/vip-room.jpg', 'vie_nocturne', 'paris'),
('Le Duplex', 'Club sur deux niveaux', 45, '25 Avenue du Maine, 75015 Paris', '/images/activities/duplex.jpg', 'vie_nocturne', 'paris'),
('Le Queen', 'Club gay mythique', 40, '102 Avenue des Champs-Élysées, 75008 Paris', '/images/activities/queen.jpg', 'vie_nocturne', 'paris'),
('Le Buddha-Bar', 'Lounge bar asiatique', 55, '8 Rue Boissy d''Anglas, 75008 Paris', '/images/activities/buddha-bar.jpg', 'vie_nocturne', 'paris'),

-- Vie Nocturne Paris - Luxe
('Soirée Privée à l''Opéra', 'Événement exclusif dans un lieu historique', 200, 'Palais Garnier, 75009 Paris', '/images/activities/opera-prive.jpg', 'vie_nocturne', 'paris'),
('Yacht Party sur la Seine', 'Soirée privée sur un yacht de luxe', 300, 'Port de Paris', '/images/activities/yacht-party.jpg', 'vie_nocturne', 'paris'),
('Soirée au Château', 'Événement privé dans un château', 400, 'Château de la région parisienne', '/images/activities/chateau-soiree.jpg', 'vie_nocturne', 'paris'),
('Helicopter Night Tour', 'Tour de Paris en hélicoptère de nuit', 500, 'Aéroport de Paris-Le Bourget', '/images/activities/helico-nuit.jpg', 'vie_nocturne', 'paris'),
('Week-end VIP à Paris', 'Expérience nocturne complète', 1000, 'Hôtels de luxe parisiens', '/images/activities/weekend-vip.jpg', 'vie_nocturne', 'paris'),

-- Sport Paris - Gratuit
('Parc des Buttes-Chaumont', 'Parc avec sentiers de course', 0, '1 Rue Botzaris, 75019 Paris', '/images/activities/buttes-chaumont.jpg', 'sport', 'paris'),
('Coulée Verte', 'Piste cyclable surélevée', 0, '1 Avenue Daumesnil, 75012 Paris', '/images/activities/coulee-verte.jpg', 'sport', 'paris'),
('Bois de Vincennes', 'Plus grand parc de Paris', 0, 'Route de la Pyramide, 75012 Paris', '/images/activities/vincennes.jpg', 'sport', 'paris'),
('Quais de Seine', 'Piste cyclable le long de la Seine', 0, 'Quais de Seine, 75001 Paris', '/images/activities/quais-cyclables.jpg', 'sport', 'paris'),
('Parc Monceau', 'Jardin public avec espace fitness', 0, '35 Boulevard de Courcelles, 75008 Paris', '/images/activities/monceau.jpg', 'sport', 'paris'),

-- Sport Paris - Budget
('Vélib', 'Location de vélo en libre-service', 5, 'Stations partout dans Paris', '/images/activities/velib.jpg', 'sport', 'paris'),
('Piscine Joséphine Baker', 'Piscine flottante sur la Seine', 4, 'Quai François Mauriac, 75013 Paris', '/images/activities/piscine-baker.jpg', 'sport', 'paris'),
('Stade Charléty', 'Stade d''athlétisme public', 8, '15 Avenue Pierre de Coubertin, 75013 Paris', '/images/activities/charlety.jpg', 'sport', 'paris'),
('Tennis Public', 'Courts de tennis municipaux', 10, 'Diverses locations à Paris', '/images/activities/tennis-public.jpg', 'sport', 'paris'),
('Parcours Sportif', 'Parcours de fitness en plein air', 0, 'Diverses locations à Paris', '/images/activities/parcours-sportif.jpg', 'sport', 'paris'),

-- Sport Paris - Moyen
('Escalade Arkose', 'Salle d''escalade de bloc', 15, '33 Rue Traversière, 75012 Paris', '/images/activities/arkose.jpg', 'sport', 'paris'),
('Fitness Park', 'Salle de sport moderne', 30, 'Diverses locations à Paris', '/images/activities/fitness-park.jpg', 'sport', 'paris'),
('Piscine Pontoise', 'Piscine historique art déco', 20, '19 Rue de Pontoise, 75005 Paris', '/images/activities/piscine-pontoise.jpg', 'sport', 'paris'),
('Stade Jean-Bouin', 'Stade de rugby et tennis', 25, '26 Avenue du Général Sarrail, 75016 Paris', '/images/activities/jean-bouin.jpg', 'sport', 'paris'),
('Roland Garros Museum', 'Musée du tennis français', 15, '2 Avenue Gordon Bennett, 75016 Paris', '/images/activities/roland-garros-museum.jpg', 'sport', 'paris'),

-- Sport Paris - Premium
('Roland Garros', 'Visite du stade mythique', 20, '2 Avenue Gordon Bennett, 75016 Paris', '/images/activities/roland-garros.jpg', 'sport', 'paris'),
('Parc des Princes', 'Visite du stade du PSG', 25, '24 Rue du Commandant Guilbaud, 75016 Paris', '/images/activities/parc-princes.jpg', 'sport', 'paris'),
('Stade de France', 'Visite du stade national', 30, '93200 Saint-Denis', '/images/activities/stade-france.jpg', 'sport', 'paris'),
('Golf de Paris', 'Parcours de golf urbain', 40, 'Rue du Lieutenant-Colonel de Montbrison, 75016 Paris', '/images/activities/golf-paris.jpg', 'sport', 'paris'),
('Tennis Club de Paris', 'Club de tennis historique', 35, '41 Avenue de la Porte d''Auteuil, 75016 Paris', '/images/activities/tennis-club.jpg', 'sport', 'paris'),

-- Sport Paris - Luxe
('Leçon Privée de Tennis', 'Cours avec un pro', 150, 'Tennis Club de Paris', '/images/activities/tennis-prive.jpg', 'sport', 'paris'),
('Expérience VIP Roland Garros', 'Visite privée et déjeuner', 200, '2 Avenue Gordon Bennett, 75016 Paris', '/images/activities/roland-garros-vip.jpg', 'sport', 'paris'),
('Golf Privé', 'Parcours privé avec pro', 250, 'Golf de Paris', '/images/activities/golf-prive.jpg', 'sport', 'paris'),
('Spa Sportif', 'Centre de bien-être haut de gamme', 300, 'Centre de bien-être parisien', '/images/activities/spa-sport.jpg', 'sport', 'paris'),
('Week-end Sportif de Luxe', 'Expérience sportive complète', 500, 'Hôtel de luxe parisien', '/images/activities/weekend-sport.jpg', 'sport', 'paris'),

-- Nature Paris - Gratuit
('Jardin des Tuileries', 'Jardin à la française', 0, 'Place de la Concorde, 75001 Paris', '/images/activities/tuileries.jpg', 'nature', 'paris'),
('Bois de Vincennes', 'Plus grand espace vert de Paris', 0, 'Route de la Pyramide, 75012 Paris', '/images/activities/vincennes.jpg', 'nature', 'paris'),
('Jardin des Plantes', 'Jardin botanique historique', 0, '57 Rue Cuvier, 75005 Paris', '/images/activities/jardin-plantes.jpg', 'nature', 'paris'),
('Parc des Buttes-Chaumont', 'Parc pittoresque avec falaises', 0, '1 Rue Botzaris, 75019 Paris', '/images/activities/buttes-chaumont.jpg', 'nature', 'paris'),
('Coulée verte René-Dumont', 'Promenade plantée', 0, '1 Coulée verte René-Dumont, 75012 Paris', '/images/activities/coulee-verte.jpg', 'nature', 'paris'),

-- Nature Paris - Budget
('Jardin d''Acclimatation', 'Parc d''attractions familial', 5, 'Bois de Boulogne, 75016 Paris', '/images/activities/acclimatation.jpg', 'nature', 'paris'),
('Parc de Belleville', 'Parc avec vue panoramique', 0, '47 Rue des Couronnes, 75020 Paris', '/images/activities/belleville.jpg', 'nature', 'paris'),
('Jardin du Luxembourg', 'Jardin public historique', 0, 'Rue de Médicis, 75006 Paris', '/images/activities/luxembourg.jpg', 'nature', 'paris'),
('Parc Monceau', 'Jardin à l''anglaise', 0, '35 Boulevard de Courcelles, 75008 Paris', '/images/activities/monceau.jpg', 'nature', 'paris'),
('Square du Vert-Galant', 'Square romantique sur l''île de la Cité', 0, '15 Place du Pont-Neuf, 75001 Paris', '/images/activities/vert-galant.jpg', 'nature', 'paris'),

-- Nature Paris - Moyen
('Serres d''Auteuil', 'Serres tropicales historiques', 8, '3 Avenue de la Porte d''Auteuil, 75016 Paris', '/images/activities/serres-auteuil.jpg', 'nature', 'paris'),
('Jardin des Serres', 'Serres du Jardin des Plantes', 10, '57 Rue Cuvier, 75005 Paris', '/images/activities/serres.jpg', 'nature', 'paris'),
('Parc Floral', 'Parc floral de Paris', 6, 'Route du Champ-de-Manoeuvre, 75012 Paris', '/images/activities/parc-floral.jpg', 'nature', 'paris'),
('Jardin Atlantique', 'Jardin suspendu', 0, '1 Place des 5 Martyrs du Lycée Buffon, 75015 Paris', '/images/activities/atlantique.jpg', 'nature', 'paris'),
('Parc de Bercy', 'Parc moderne avec vignes', 0, '128 Quai de Bercy, 75012 Paris', '/images/activities/bercy.jpg', 'nature', 'paris'),

-- Nature Paris - Premium
('Jardin des Plantes', 'Visite guidée des serres', 15, '57 Rue Cuvier, 75005 Paris', '/images/activities/jardin-plantes-guide.jpg', 'nature', 'paris'),
('Bois de Boulogne', 'Balade à cheval', 45, 'Bois de Boulogne, 75016 Paris', '/images/activities/boulogne-cheval.jpg', 'nature', 'paris'),
('Parc de Bagatelle', 'Roseraie historique', 12, 'Bois de Boulogne, 75016 Paris', '/images/activities/bagatelle.jpg', 'nature', 'paris'),
('Jardin des Serres d''Auteuil', 'Visite guidée privée', 20, '3 Avenue de la Porte d''Auteuil, 75016 Paris', '/images/activities/serres-guide.jpg', 'nature', 'paris'),
('Parc de Sceaux', 'Domaine historique', 15, '8 Avenue Claude Perrault, 92330 Sceaux', '/images/activities/sceaux.jpg', 'nature', 'paris'),

-- Nature Paris - Luxe
('Jardin Privé des Tuileries', 'Visite exclusive avant l''ouverture', 100, 'Place de la Concorde, 75001 Paris', '/images/activities/tuileries-prive.jpg', 'nature', 'paris'),
('Balade en Montgolfière', 'Survol de Paris et ses jardins', 250, 'Départ de la région parisienne', '/images/activities/montgolfiere.jpg', 'nature', 'paris'),
('Dîner dans les Serres', 'Expérience gastronomique unique', 200, 'Jardin des Plantes, 75005 Paris', '/images/activities/serres-diner.jpg', 'nature', 'paris'),
('Week-end au Château', 'Séjour dans un domaine historique', 500, 'Château de la région parisienne', '/images/activities/chateau-nature.jpg', 'nature', 'paris'),
('Expérience Botanique', 'Cours privé avec expert', 300, 'Jardin des Plantes, 75005 Paris', '/images/activities/botanique.jpg', 'nature', 'paris');

-- Vérification du nombre d'activités insérées
SELECT COUNT(*) as total_activities FROM activities;

UPDATE activities
SET imageurl = CONCAT('/images/activities/', id, '.jpg')
WHERE imageurl IS NULL; 