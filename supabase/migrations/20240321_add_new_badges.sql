-- Ajouter de nouveaux badges
INSERT INTO public.badges (name, description, icon_url, points_required, category) VALUES
  -- Badges de progression
  ('Voyageur Bronze', 'Atteignez le niveau 5', '/badges/bronze-traveler.svg', 5000, 'program'),
  ('Voyageur Argent', 'Atteignez le niveau 10', '/badges/silver-traveler.svg', 10000, 'program'),
  ('Voyageur Or', 'Atteignez le niveau 20', '/badges/gold-traveler.svg', 20000, 'program'),
  ('Voyageur Platine', 'Atteignez le niveau 30', '/badges/platinum-traveler.svg', 30000, 'program'),

  -- Badges de spécialisation
  ('Gastronome Expert', 'Ajoutez 20 activités gastronomiques', '/badges/food-expert.svg', 1000, 'activity'),
  ('Guide Culturel', 'Ajoutez 20 activités culturelles', '/badges/culture-expert.svg', 1000, 'activity'),
  ('Sportif Confirmé', 'Ajoutez 20 activités sportives', '/badges/sport-expert.svg', 1000, 'activity'),
  ('Noctambule Pro', 'Ajoutez 20 activités nocturnes', '/badges/night-expert.svg', 1000, 'activity'),
  ('Explorateur Nature', 'Ajoutez 20 activités en plein air', '/badges/nature-expert.svg', 1000, 'activity'),

  -- Badges de challenge
  ('Budget Master', 'Créez un programme complet avec un budget inférieur à 500€', '/badges/budget-master.svg', 800, 'program'),
  ('Luxe & Confort', 'Créez un programme avec un budget supérieur à 2000€', '/badges/luxury.svg', 800, 'program'),
  ('Voyage Express', 'Créez un programme de 2 jours ou moins', '/badges/express.svg', 600, 'program'),
  ('Voyage Longue Durée', 'Créez un programme de 7 jours ou plus', '/badges/long-stay.svg', 800, 'program'),

  -- Badges de diversité
  ('Globe-trotter', 'Créez des programmes dans 5 villes différentes', '/badges/globe-trotter.svg', 1500, 'program'),
  ('Explorateur Urbain', 'Créez des programmes dans 3 capitales européennes', '/badges/urban-explorer.svg', 1200, 'program'),
  ('Aventurier Multi-saisons', 'Créez des programmes dans 4 saisons différentes', '/badges/seasons.svg', 1000, 'program'),

  -- Badges de style de voyage
  ('Voyageur Solo', 'Créez 3 programmes en solo', '/badges/solo.svg', 600, 'program'),
  ('Couple Romantique', 'Créez 3 programmes en couple', '/badges/couple.svg', 600, 'program'),
  ('Famille Aventurière', 'Créez 3 programmes en famille', '/badges/family.svg', 600, 'program'),
  ('Groupe d''Amis', 'Créez 3 programmes entre amis', '/badges/friends.svg', 600, 'program'),

  -- Badges de performance
  ('Maître Planificateur', 'Créez un programme avec plus de 10 activités', '/badges/master-planner.svg', 1000, 'program'),
  ('Équilibré', 'Créez un programme avec au moins une activité de chaque catégorie', '/badges/balanced.svg', 800, 'program'),
  ('Efficace', 'Créez un programme avec des activités optimisées par créneau horaire', '/badges/efficient.svg', 700, 'program'); 