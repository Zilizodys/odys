export interface Activity {
  id: string
  title: string
  description: string
  category: string
  price: number
  address: string
  imageurl: string
  city: string
  price_range: string
}

export const activities: Activity[] = [
  // Culture Paris
  {
    id: 'p-cult-1',
    title: 'Musée du Louvre',
    description: 'Le plus grand musée d\'art au monde',
    category: 'culture',
    price: 17,
    address: 'Rue de Rivoli, 75001 Paris',
    imageurl: '/images/activities/louvre.jpg',
    city: 'paris',
    price_range: '17€'
  },
  {
    id: 'p-cult-2',
    title: 'Musée d\'Orsay',
    description: 'Collection impressionniste dans une ancienne gare',
    category: 'culture',
    price: 16,
    address: '1 Rue de la Légion d\'Honneur, 75007 Paris',
    imageurl: '/images/activities/orsay.jpg',
    city: 'paris',
    price_range: '16€'
  },
  {
    id: 'p-cult-3',
    title: 'Centre Pompidou',
    description: 'Art moderne et contemporain',
    category: 'culture',
    price: 14,
    address: 'Place Georges-Pompidou, 75004 Paris',
    imageurl: '/images/activities/pompidou.jpg',
    city: 'paris',
    price_range: '14€'
  },
  {
    id: 'p-cult-4',
    title: 'Musée de l\'Orangerie',
    description: 'Les Nymphéas de Monet et collection impressionniste',
    category: 'culture',
    price: 12,
    address: 'Jardin des Tuileries, 75001 Paris',
    imageurl: '/images/activities/orangerie.jpg',
    city: 'paris',
    price_range: '12€'
  },
  {
    id: 'p-cult-5',
    title: 'Musée Carnavalet',
    description: 'Histoire de Paris à travers les siècles',
    category: 'culture',
    price: 0,
    address: '23 Rue de Sévigné, 75003 Paris',
    imageurl: '/images/activities/carnavalet.jpg',
    city: 'paris',
    price_range: 'gratuit'
  },

  // Gastronomie Paris
  {
    id: 'p-gast-1',
    title: 'Le Chateaubriand',
    description: 'Restaurant gastronomique moderne et créatif',
    category: 'gastronomie',
    price: 95,
    address: '129 Avenue Parmentier, 75011 Paris',
    imageurl: '/images/activities/chateaubriand.jpg',
    city: 'paris',
    price_range: '95€'
  },
  {
    id: 'p-gast-2',
    title: 'L\'Arpège',
    description: 'Restaurant 3 étoiles Michelin, cuisine légumière',
    category: 'gastronomie',
    price: 175,
    address: '84 Rue de Varenne, 75007 Paris',
    imageurl: '/images/activities/arpege.jpg',
    city: 'paris',
    price_range: '175€'
  },
  {
    id: 'p-gast-3',
    title: 'Bistrot Paul Bert',
    description: 'Cuisine française traditionnelle dans un cadre authentique',
    category: 'gastronomie',
    price: 65,
    address: '18 Rue Paul Bert, 75011 Paris',
    imageurl: '/images/activities/paul-bert.jpg',
    city: 'paris',
    price_range: '65€'
  },
  {
    id: 'p-gast-4',
    title: 'Le Baratin',
    description: 'Cuisine du marché créative et raffinée',
    category: 'gastronomie',
    price: 55,
    address: '3 Rue Jouye-Rouve, 75020 Paris',
    imageurl: '/images/activities/baratin.jpg',
    city: 'paris',
    price_range: '55€'
  },
  {
    id: 'p-gast-5',
    title: 'Clown Bar',
    description: 'Cuisine contemporaine dans un ancien cirque',
    category: 'gastronomie',
    price: 85,
    address: '114 Rue Amelot, 75011 Paris',
    imageurl: '/images/activities/clown-bar.jpg',
    city: 'paris',
    price_range: '85€'
  },

  // Vie Nocturne Paris
  {
    id: 'p-nuit-1',
    title: 'Le Comptoir Général',
    description: 'Bar caché avec ambiance coloniale et cocktails exotiques',
    category: 'vie nocturne',
    price: 12,
    address: '80 Quai de Jemmapes, 75010 Paris',
    imageurl: '/images/activities/comptoir-general.jpg',
    city: 'paris',
    price_range: '12€'
  },
  {
    id: 'p-nuit-2',
    title: 'Le Perchoir Marais',
    description: 'Rooftop bar avec vue panoramique sur Paris',
    category: 'vie nocturne',
    price: 15,
    address: '33 Rue de la Verrerie, 75004 Paris',
    imageurl: '/images/activities/perchoir.jpg',
    city: 'paris',
    price_range: '15€'
  },
  {
    id: 'p-nuit-3',
    title: 'La Bellevilloise',
    description: 'Club culturel avec concerts et soirées',
    category: 'vie nocturne',
    price: 20,
    address: '19-21 Rue Boyer, 75020 Paris',
    imageurl: '/images/activities/bellevilloise.jpg',
    city: 'paris',
    price_range: '20€'
  },
  {
    id: 'p-nuit-4',
    title: 'Le Baron Rouge',
    description: 'Bar à vin traditionnel et authentique',
    category: 'vie nocturne',
    price: 8,
    address: '1 Rue Théophile Roussel, 75012 Paris',
    imageurl: '/images/activities/baron-rouge.jpg',
    city: 'paris',
    price_range: '8€'
  },
  {
    id: 'p-nuit-5',
    title: 'Experimental Cocktail Club',
    description: 'Bar à cocktails sophistiqué du Marais',
    category: 'vie nocturne',
    price: 14,
    address: '37 Rue Saint-Sauveur, 75002 Paris',
    imageurl: '/images/activities/ecc.jpg',
    city: 'paris',
    price_range: '14€'
  },

  // Sport Paris
  {
    id: 'p-sport-1',
    title: 'Roland Garros',
    description: 'Visite du stade mythique du tennis français',
    category: 'sport',
    price: 20,
    address: '2 Avenue Gordon Bennett, 75016 Paris',
    imageurl: '/images/activities/roland-garros.jpg',
    city: 'paris',
    price_range: '20€'
  },
  {
    id: 'p-sport-2',
    title: 'Parc des Princes',
    description: 'Visite du stade du Paris Saint-Germain',
    category: 'sport',
    price: 25,
    address: '24 Rue du Commandant Guilbaud, 75016 Paris',
    imageurl: '/images/activities/parc-princes.jpg',
    city: 'paris',
    price_range: '25€'
  },
  {
    id: 'p-sport-3',
    title: 'Vélib Paris',
    description: 'Location de vélo pour explorer la ville',
    category: 'sport',
    price: 5,
    address: 'Stations partout dans Paris',
    imageurl: '/images/activities/velib.jpg',
    city: 'paris',
    price_range: '5€'
  },
  {
    id: 'p-sport-4',
    title: 'Piscine Joséphine Baker',
    description: 'Piscine flottante sur la Seine',
    category: 'sport',
    price: 4,
    address: 'Quai François Mauriac, 75013 Paris',
    imageurl: '/images/activities/piscine-baker.jpg',
    city: 'paris',
    price_range: '4€'
  },
  {
    id: 'p-sport-5',
    title: 'Escalade Arkose',
    description: 'Salle d\'escalade de bloc urbaine',
    category: 'sport',
    price: 15,
    address: '33 Rue Traversière, 75012 Paris',
    imageurl: '/images/activities/arkose.jpg',
    city: 'paris',
    price_range: '15€'
  },

  // Nature Paris
  {
    id: 'p-nat-1',
    title: 'Jardin des Tuileries',
    description: 'Jardin à la française entre le Louvre et la Concorde',
    category: 'nature',
    price: 0,
    address: 'Place de la Concorde, 75001 Paris',
    imageurl: '/images/activities/tuileries.jpg',
    city: 'paris',
    price_range: 'gratuit'
  },
  {
    id: 'p-nat-2',
    title: 'Bois de Vincennes',
    description: 'Plus grand espace vert de Paris avec lac et zoo',
    category: 'nature',
    price: 0,
    address: 'Route de la Pyramide, 75012 Paris',
    imageurl: '/images/activities/vincennes.jpg',
    city: 'paris',
    price_range: 'gratuit'
  },
  {
    id: 'p-nat-3',
    title: 'Jardin des Plantes',
    description: 'Jardin botanique historique avec serres et ménagerie',
    category: 'nature',
    price: 0,
    address: '57 Rue Cuvier, 75005 Paris',
    imageurl: '/images/activities/jardin-plantes.jpg',
    city: 'paris',
    price_range: 'gratuit'
  },
  {
    id: 'p-nat-4',
    title: 'Parc des Buttes-Chaumont',
    description: 'Parc romantique avec falaises et lac',
    category: 'nature',
    price: 0,
    address: '1 Rue Botzaris, 75019 Paris',
    imageurl: '/images/activities/buttes-chaumont.jpg',
    city: 'paris',
    price_range: 'gratuit'
  },
  {
    id: 'p-nat-5',
    title: 'Coulée verte René-Dumont',
    description: 'Promenade surélevée sur une ancienne voie ferrée',
    category: 'nature',
    price: 0,
    address: '1 Coulée verte René-Dumont, 75012 Paris',
    imageurl: '/images/activities/coulee-verte.jpg',
    city: 'paris',
    price_range: 'gratuit'
  },

  // Culture Lyon
  {
    id: 'l-cult-1',
    title: 'Musée des Confluences',
    description: 'Musée d\'histoire naturelle et des sociétés dans un bâtiment futuriste',
    category: 'culture',
    price: 12,
    address: '86 Quai Perrache, 69002 Lyon',
    imageurl: '/images/activities/confluences.jpg',
    city: 'lyon',
    price_range: '12€'
  },
  {
    id: 'l-cult-2',
    title: 'Basilique Notre-Dame de Fourvière',
    description: 'Basilique emblématique surplombant Lyon',
    category: 'culture',
    price: 0,
    address: '8 Place de Fourvière, 69005 Lyon',
    imageurl: '/images/activities/fourviere.jpg',
    city: 'lyon',
    price_range: 'gratuit'
  },
  {
    id: 'l-cult-3',
    title: 'Vieux Lyon',
    description: 'Quartier historique avec ses traboules',
    category: 'culture',
    price: 0,
    address: 'Vieux Lyon, 69005 Lyon',
    imageurl: '/images/activities/vieux-lyon.jpg',
    city: 'lyon',
    price_range: 'gratuit'
  },

  // Gastronomie Lyon
  {
    id: 'l-gast-1',
    title: 'Les Halles Paul Bocuse',
    description: 'Temple de la gastronomie lyonnaise',
    category: 'gastronomie',
    price: 0,
    address: '102 Cours Lafayette, 69003 Lyon',
    imageurl: '/images/activities/halles-bocuse.jpg',
    city: 'lyon',
    price_range: 'gratuit'
  },
  {
    id: 'l-gast-2',
    title: 'Bouchon Daniel et Denise',
    description: 'Restaurant traditionnel lyonnais',
    category: 'gastronomie',
    price: 45,
    address: '36 Rue Tramassac, 69005 Lyon',
    imageurl: '/images/activities/bouchon.jpg',
    city: 'lyon',
    price_range: '45€'
  },
  {
    id: 'l-gast-3',
    title: 'La Mère Brazier',
    description: 'Restaurant 2 étoiles Michelin historique',
    category: 'gastronomie',
    price: 160,
    address: '12 Rue Royale, 69001 Lyon',
    imageurl: '/images/activities/mere-brazier.jpg',
    city: 'lyon',
    price_range: '160€'
  },

  // Vie Nocturne Lyon
  {
    id: 'l-nuit-1',
    title: 'Le Sucre',
    description: 'Club électro sur le toit de la Sucrière',
    category: 'vie nocturne',
    price: 15,
    address: '50 Quai Rambaud, 69002 Lyon',
    imageurl: '/images/activities/sucre.jpg',
    city: 'lyon',
    price_range: '15€'
  },
  {
    id: 'l-nuit-2',
    title: 'Bec de Jazz',
    description: 'Club de jazz historique',
    category: 'vie nocturne',
    price: 10,
    address: '19 Rue Burdeau, 69001 Lyon',
    imageurl: '/images/activities/bec-jazz.jpg',
    city: 'lyon',
    price_range: '10€'
  },

  // Nature Lyon
  {
    id: 'l-nat-1',
    title: 'Parc de la Tête d\'Or',
    description: 'Plus grand parc urbain de France avec zoo gratuit',
    category: 'nature',
    price: 0,
    address: '69006 Lyon',
    imageurl: '/images/activities/tete-or.jpg',
    city: 'lyon',
    price_range: 'gratuit'
  },
  {
    id: 'l-nat-2',
    title: 'Berges du Rhône',
    description: 'Promenade aménagée le long du Rhône',
    category: 'nature',
    price: 0,
    address: 'Quai Claude Bernard, 69007 Lyon',
    imageurl: '/images/activities/berges-rhone.jpg',
    city: 'lyon',
    price_range: 'gratuit'
  },

  // Culture Marseille
  {
    id: 'm-cult-1',
    title: 'MUCEM',
    description: 'Musée des Civilisations de l\'Europe et de la Méditerranée',
    category: 'culture',
    price: 11,
    address: '7 Promenade Robert Laffont, 13002 Marseille',
    imageurl: '/images/activities/mucem.jpg',
    city: 'marseille',
    price_range: '11€'
  },
  {
    id: 'm-cult-2',
    title: 'Notre-Dame de la Garde',
    description: 'Basilique emblématique surplombant Marseille',
    category: 'culture',
    price: 0,
    address: 'Rue Fort du Sanctuaire, 13281 Marseille',
    imageurl: '/images/activities/notre-dame-garde.jpg',
    city: 'marseille',
    price_range: 'gratuit'
  },

  // Gastronomie Marseille
  {
    id: 'm-gast-1',
    title: 'Chez Michel',
    description: 'Restaurant traditionnel spécialisé en bouillabaisse',
    category: 'gastronomie',
    price: 65,
    address: '6 Rue des Catalans, 13007 Marseille',
    imageurl: '/images/activities/chez-michel.jpg',
    city: 'marseille',
    price_range: '65€'
  },
  {
    id: 'm-gast-2',
    title: 'L\'Épuisette',
    description: 'Restaurant étoilé avec vue sur le Vieux-Port',
    category: 'gastronomie',
    price: 95,
    address: 'Vallon des Auffes, 13007 Marseille',
    imageurl: '/images/activities/epuisette.jpg',
    city: 'marseille',
    price_range: '95€'
  },

  // Nature Marseille
  {
    id: 'm-nat-1',
    title: 'Calanques',
    description: 'Parc national des Calanques',
    category: 'nature',
    price: 0,
    address: 'Calanques, 13009 Marseille',
    imageurl: '/images/activities/calanques.jpg',
    city: 'marseille',
    price_range: 'gratuit'
  },
  {
    id: 'm-nat-2',
    title: 'Îles du Frioul',
    description: 'Archipel sauvage face à Marseille',
    category: 'nature',
    price: 12,
    address: 'Quai du Port, 13001 Marseille',
    imageurl: '/images/activities/frioul.jpg',
    city: 'marseille',
    price_range: '12€'
  },

  // Sport Marseille
  {
    id: 'm-sport-1',
    title: 'Orange Vélodrome',
    description: 'Visite du stade mythique de l\'OM',
    category: 'sport',
    price: 18,
    address: '3 Boulevard Michelet, 13008 Marseille',
    imageurl: '/images/activities/velodrome.jpg',
    city: 'marseille',
    price_range: '18€'
  },
  {
    id: 'm-sport-2',
    title: 'Plongée Marseille',
    description: 'Plongée dans les eaux cristallines des calanques',
    category: 'sport',
    price: 80,
    address: 'Port de la Pointe Rouge, 13008 Marseille',
    imageurl: '/images/activities/plongee.jpg',
    city: 'marseille',
    price_range: '80€'
  },

  // Culture Londres
  {
    id: 'lo-cult-1',
    title: 'British Museum',
    description: 'Collection d\'antiquités mondiales',
    category: 'culture',
    price: 0,
    address: 'Great Russell St, London WC1B 3DG',
    imageurl: '/images/activities/british-museum.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-cult-2',
    title: 'Tate Modern',
    description: 'Musée d\'art moderne et contemporain',
    category: 'culture',
    price: 0,
    address: 'Bankside, London SE1 9TG',
    imageurl: '/images/activities/tate-modern.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-cult-3',
    title: 'Tower of London',
    description: 'Forteresse historique et joyaux de la couronne',
    category: 'culture',
    price: 29.90,
    address: 'St Katharine\'s & Wapping, London EC3N 4AB',
    imageurl: '/images/activities/tower-london.jpg',
    city: 'londres',
    price_range: '29.90€'
  },
  {
    id: 'lo-cult-4',
    title: 'National Gallery',
    description: 'Collection de peintures européennes',
    category: 'culture',
    price: 0,
    address: 'Trafalgar Square, London WC2N 5DN',
    imageurl: '/images/activities/national-gallery.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-cult-5',
    title: 'Shakespeare\'s Globe',
    description: 'Reconstitution du théâtre de Shakespeare',
    category: 'culture',
    price: 25,
    address: '21 New Globe Walk, London SE1 9DT',
    imageurl: '/images/activities/globe.jpg',
    city: 'londres',
    price_range: '25€'
  },

  // Gastronomie Londres
  {
    id: 'lo-gast-1',
    title: 'Borough Market',
    description: 'Marché gastronomique historique',
    category: 'gastronomie',
    price: 0,
    address: '8 Southwark St, London SE1 1TL',
    imageurl: '/images/activities/borough-market.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-gast-2',
    title: 'Restaurant Gordon Ramsay',
    description: 'Restaurant 3 étoiles Michelin',
    category: 'gastronomie',
    price: 180,
    address: '68 Royal Hospital Rd, London SW3 4HP',
    imageurl: '/images/activities/gordon-ramsay.jpg',
    city: 'londres',
    price_range: '180€'
  },
  {
    id: 'lo-gast-3',
    title: 'Sketch',
    description: 'Restaurant artistique et salon de thé',
    category: 'gastronomie',
    price: 95,
    address: '9 Conduit St, London W1S 2XG',
    imageurl: '/images/activities/sketch.jpg',
    city: 'londres',
    price_range: '95€'
  },
  {
    id: 'lo-gast-4',
    title: 'Brick Lane',
    description: 'Rue des meilleurs curry de Londres',
    category: 'gastronomie',
    price: 25,
    address: 'Brick Lane, London E1 6SB',
    imageurl: '/images/activities/brick-lane.jpg',
    city: 'londres',
    price_range: '25€'
  },
  {
    id: 'lo-gast-5',
    title: 'Fortnum & Mason',
    description: 'Épicerie fine et salon de thé traditionnel',
    category: 'gastronomie',
    price: 60,
    address: '181 Piccadilly, St. James\'s, London W1A 1ER',
    imageurl: '/images/activities/fortnum.jpg',
    city: 'londres',
    price_range: '60€'
  },

  // Vie Nocturne Londres
  {
    id: 'lo-nuit-1',
    title: 'Ministry of Sound',
    description: 'Club emblématique de musique électronique',
    category: 'vie nocturne',
    price: 25,
    address: '103 Gaunt St, London SE1 6DP',
    imageurl: '/images/activities/ministry.jpg',
    city: 'londres',
    price_range: '25€'
  },
  {
    id: 'lo-nuit-2',
    title: 'Ronnie Scott\'s',
    description: 'Club de jazz historique',
    category: 'vie nocturne',
    price: 30,
    address: '47 Frith St, London W1D 4HT',
    imageurl: '/images/activities/ronnie-scotts.jpg',
    city: 'londres',
    price_range: '30€'
  },
  {
    id: 'lo-nuit-3',
    title: 'Sky Garden',
    description: 'Bar avec vue panoramique',
    category: 'vie nocturne',
    price: 0,
    address: '20 Fenchurch St, London EC3M 8AF',
    imageurl: '/images/activities/sky-garden.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-nuit-4',
    title: 'Fabric',
    description: 'Club underground légendaire',
    category: 'vie nocturne',
    price: 20,
    address: '77A Charterhouse St, London EC1M 6HJ',
    imageurl: '/images/activities/fabric.jpg',
    city: 'londres',
    price_range: '20€'
  },
  {
    id: 'lo-nuit-5',
    title: 'The Shard',
    description: 'Bars et restaurants avec vue sur Londres',
    category: 'vie nocturne',
    price: 15,
    address: '32 London Bridge St, London SE1 9SG',
    imageurl: '/images/activities/shard.jpg',
    city: 'londres',
    price_range: '15€'
  },

  // Sport Londres
  {
    id: 'lo-sport-1',
    title: 'Wimbledon',
    description: 'Visite du temple du tennis',
    category: 'sport',
    price: 25,
    address: 'Church Rd, London SW19 5AE',
    imageUrl: '/images/activities/wimbledon.jpg',
    city: 'londres',
    price_range: '25€'
  },
  {
    id: 'lo-sport-2',
    title: 'Emirates Stadium',
    description: 'Stade d\'Arsenal FC',
    category: 'sport',
    price: 27,
    address: 'Hornsey Rd, London N7 7AJ',
    imageUrl: '/images/activities/emirates.jpg',
    city: 'londres',
    price_range: '27€'
  },
  {
    id: 'lo-sport-3',
    title: 'Lords Cricket Ground',
    description: 'Le temple du cricket',
    category: 'sport',
    price: 20,
    address: 'St John\'s Wood Rd, London NW8 8QN',
    imageUrl: '/images/activities/lords.jpg',
    city: 'londres',
    price_range: '20€'
  },
  {
    id: 'lo-sport-4',
    title: 'London Aquatics Centre',
    description: 'Centre aquatique olympique',
    category: 'sport',
    price: 5,
    address: 'Queen Elizabeth Olympic Park, London E20 2ZQ',
    imageUrl: '/images/activities/aquatics.jpg',
    city: 'londres',
    price_range: '5€'
  },
  {
    id: 'lo-sport-5',
    title: 'Lee Valley VeloPark',
    description: 'Vélodrome olympique',
    category: 'sport',
    price: 35,
    address: 'Abercrombie Road, Queen Elizabeth Olympic Park, London E20 3AB',
    imageUrl: '/images/activities/velopark.jpg',
    city: 'londres',
    price_range: '35€'
  },

  // Nature Londres
  {
    id: 'lo-nat-1',
    title: 'Hyde Park',
    description: 'Plus grand parc royal de Londres',
    category: 'nature',
    price: 0,
    address: 'Hyde Park, London W2 2UH',
    imageUrl: '/images/activities/hyde-park.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-nat-2',
    title: 'Kew Gardens',
    description: 'Jardins botaniques royaux',
    category: 'nature',
    price: 19.50,
    address: 'Richmond, London TW9 3AE',
    imageUrl: '/images/activities/kew.jpg',
    city: 'londres',
    price_range: '19.50€'
  },
  {
    id: 'lo-nat-3',
    title: 'Hampstead Heath',
    description: 'Parc sauvage avec vue sur Londres',
    category: 'nature',
    price: 0,
    address: 'Hampstead, London NW3 7JP',
    imageUrl: '/images/activities/hampstead.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-nat-4',
    title: 'Richmond Park',
    description: 'Parc naturel avec cerfs en liberté',
    category: 'nature',
    price: 0,
    address: 'Richmond, London TW10 5HS',
    imageUrl: '/images/activities/richmond.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },
  {
    id: 'lo-nat-5',
    title: 'Greenwich Park',
    description: 'Parc historique avec observatoire royal',
    category: 'nature',
    price: 0,
    address: 'Greenwich, London SE10 8QY',
    imageUrl: '/images/activities/greenwich.jpg',
    city: 'londres',
    price_range: 'gratuit'
  },

  // Culture Rome
  {
    id: 'r-cult-1',
    title: 'Colisée',
    description: 'Amphithéâtre antique emblématique',
    category: 'culture',
    price: 16,
    address: 'Piazza del Colosseo, 1, 00184 Roma RM',
    imageUrl: '/images/activities/colosseum.jpg',
    city: 'rome',
    price_range: '16€'
  },
  {
    id: 'r-cult-2',
    title: 'Vatican',
    description: 'Musées du Vatican et Chapelle Sixtine',
    category: 'culture',
    price: 17,
    address: '00120 Vatican City',
    imageUrl: '/images/activities/vatican.jpg',
    city: 'rome',
    price_range: '17€'
  },
  {
    id: 'r-cult-3',
    title: 'Panthéon',
    description: 'Temple romain antique',
    category: 'culture',
    price: 0,
    address: 'Piazza della Rotonda, 00186 Roma RM',
    imageUrl: '/images/activities/pantheon.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-cult-4',
    title: 'Forum Romain',
    description: 'Centre politique de la Rome antique',
    category: 'culture',
    price: 16,
    address: 'Via della Salara Vecchia, 5/6, 00186 Roma RM',
    imageUrl: '/images/activities/forum.jpg',
    city: 'rome',
    price_range: '16€'
  },
  {
    id: 'r-cult-5',
    title: 'Galleria Borghese',
    description: 'Collection d\'art dans une villa du XVIIe siècle',
    category: 'culture',
    price: 13,
    address: 'Piazzale Scipione Borghese, 5, 00197 Roma RM',
    imageUrl: '/images/activities/borghese.jpg',
    city: 'rome',
    price_range: '13€'
  },

  // Gastronomie Rome
  {
    id: 'r-gast-1',
    title: 'Roscioli',
    description: 'Restaurant gastronomique et cave à vin',
    category: 'gastronomie',
    price: 60,
    address: 'Via dei Giubbonari, 21/22, 00186 Roma RM',
    imageUrl: '/images/activities/roscioli.jpg',
    city: 'rome',
    price_range: '60€'
  },
  {
    id: 'r-gast-2',
    title: 'La Pergola',
    description: 'Restaurant 3 étoiles Michelin',
    category: 'gastronomie',
    price: 250,
    address: 'Via Alberto Cadlolo, 101, 00136 Roma RM',
    imageUrl: '/images/activities/pergola.jpg',
    city: 'rome',
    price_range: '250€'
  },
  {
    id: 'r-gast-3',
    title: 'Mercato Centrale',
    description: 'Marché gastronomique moderne',
    category: 'gastronomie',
    price: 0,
    address: 'Via Giovanni Giolitti, 36, 00185 Roma RM',
    imageUrl: '/images/activities/mercato-centrale.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-gast-4',
    title: 'Armando al Pantheon',
    description: 'Trattoria traditionnelle romaine',
    category: 'gastronomie',
    price: 45,
    address: 'Salita dei Crescenzi, 31, 00186 Roma RM',
    imageUrl: '/images/activities/armando.jpg',
    city: 'rome',
    price_range: '45€'
  },
  {
    id: 'r-gast-5',
    title: 'Pizzeria Da Remo',
    description: 'Meilleure pizza romaine',
    category: 'gastronomie',
    price: 15,
    address: 'Piazza di Santa Maria Liberatrice, 44, 00153 Roma RM',
    imageUrl: '/images/activities/remo.jpg',
    city: 'rome',
    price_range: '15€'
  },

  // Vie Nocturne Rome
  {
    id: 'r-nuit-1',
    title: 'Trastevere',
    description: 'Quartier animé avec bars et restaurants',
    category: 'vie nocturne',
    price: 0,
    address: 'Trastevere, Rome',
    imageUrl: '/images/activities/trastevere.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-nuit-2',
    title: 'Hotel Locarno Bar',
    description: 'Bar Art déco historique',
    category: 'vie nocturne',
    price: 15,
    address: 'Via della Penna, 22, 00186 Roma RM',
    imageUrl: '/images/activities/locarno.jpg',
    city: 'rome',
    price_range: '15€'
  },
  {
    id: 'r-nuit-3',
    title: 'Jerry Thomas Speakeasy',
    description: 'Bar à cocktails caché',
    category: 'vie nocturne',
    price: 20,
    address: 'Vicolo Cellini, 30, 00186 Roma RM',
    imageUrl: '/images/activities/jerry-thomas.jpg',
    city: 'rome',
    price_range: '20€'
  },
  {
    id: 'r-nuit-4',
    title: 'Goa Club',
    description: 'Club électro underground',
    category: 'vie nocturne',
    price: 15,
    address: 'Via Giuseppe Libetta, 13, 00154 Roma RM',
    imageUrl: '/images/activities/goa.jpg',
    city: 'rome',
    price_range: '15€'
  },
  {
    id: 'r-nuit-5',
    title: 'Terrazza Les Étoiles',
    description: 'Rooftop bar avec vue sur Rome',
    category: 'vie nocturne',
    price: 20,
    address: 'Via Giovanni Vitelleschi, 34, 00193 Roma RM',
    imageUrl: '/images/activities/etoiles.jpg',
    city: 'rome',
    price_range: '20€'
  },

  // Sport Rome
  {
    id: 'r-sport-1',
    title: 'Stade Olympique',
    description: 'Stade de l\'AS Roma et de la Lazio',
    category: 'sport',
    price: 15,
    address: 'Viale dei Gladiatori, 00135 Roma RM',
    imageUrl: '/images/activities/olimpico.jpg',
    city: 'rome',
    price_range: '15€'
  },
  {
    id: 'r-sport-2',
    title: 'Tennis Club Parioli',
    description: 'Club de tennis historique',
    category: 'sport',
    price: 50,
    address: 'Largo Uberto de Morpurgo, 00199 Roma RM',
    imageUrl: '/images/activities/parioli.jpg',
    city: 'rome',
    price_range: '50€'
  },
  {
    id: 'r-sport-3',
    title: 'Bike Tour Rome',
    description: 'Visite guidée à vélo',
    category: 'sport',
    price: 35,
    address: 'Via Labicana, 49, 00184 Roma RM',
    imageUrl: '/images/activities/bike-rome.jpg',
    city: 'rome',
    price_range: '35€'
  },
  {
    id: 'r-sport-4',
    title: 'Foro Italico',
    description: 'Complexe sportif historique',
    category: 'sport',
    price: 10,
    address: 'Viale del Foro Italico, 00197 Roma RM',
    imageUrl: '/images/activities/foro-italico.jpg',
    city: 'rome',
    price_range: '10€'
  },
  {
    id: 'r-sport-5',
    title: 'Piscina delle Rose',
    description: 'Piscine olympique extérieure',
    category: 'sport',
    price: 8,
    address: 'Viale America, 20, 00144 Roma RM',
    imageUrl: '/images/activities/piscina-rose.jpg',
    city: 'rome',
    price_range: '8€'
  },

  // Nature Rome
  {
    id: 'r-nat-1',
    title: 'Villa Borghese',
    description: 'Plus grand parc public de Rome',
    category: 'nature',
    price: 0,
    address: 'Piazzale Napoleone I, 00197 Roma RM',
    imageUrl: '/images/activities/villa-borghese.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-nat-2',
    title: 'Jardin des Orangers',
    description: 'Jardin avec vue panoramique',
    category: 'nature',
    price: 0,
    address: 'Piazza Pietro D\'Illiria, 00153 Roma RM',
    imageUrl: '/images/activities/orangers.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-nat-3',
    title: 'Parc des Aqueducs',
    description: 'Parc archéologique naturel',
    category: 'nature',
    price: 0,
    address: 'Via Lemonia, 00174 Roma RM',
    imageUrl: '/images/activities/aqueducs.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-nat-4',
    title: 'Villa Ada',
    description: 'Grand parc avec lac',
    category: 'nature',
    price: 0,
    address: 'Via Salaria, 267, 00199 Roma RM',
    imageUrl: '/images/activities/villa-ada.jpg',
    city: 'rome',
    price_range: 'gratuit'
  },
  {
    id: 'r-nat-5',
    title: 'Jardin botanique',
    description: 'Collection de plantes exotiques',
    category: 'nature',
    price: 8,
    address: 'Largo Cristina di Svezia, 24, 00165 Roma RM',
    imageUrl: '/images/activities/botanique-rome.jpg',
    city: 'rome',
    price_range: '8€'
  },

  // Culture Berlin
  {
    id: 'b-cult-1',
    title: 'Musée de Pergame',
    description: 'Collection d\'antiquités monumentales',
    category: 'culture',
    price: 19,
    address: 'Bodestraße 1-3, 10178 Berlin',
    imageUrl: '/images/activities/pergamon.jpg',
    city: 'berlin',
    price_range: '19€'
  },
  {
    id: 'b-cult-2',
    title: 'East Side Gallery',
    description: 'Plus long segment conservé du Mur de Berlin',
    category: 'culture',
    price: 0,
    address: 'Mühlenstraße 3-100, 10243 Berlin',
    imageUrl: '/images/activities/east-side.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },
  {
    id: 'b-cult-3',
    title: 'Checkpoint Charlie',
    description: 'Point de passage historique du Mur de Berlin',
    category: 'culture',
    price: 14.50,
    address: 'Friedrichstraße 43-45, 10117 Berlin',
    imageUrl: '/images/activities/checkpoint.jpg',
    city: 'berlin',
    price_range: '14.50€'
  },
  {
    id: 'b-cult-4',
    title: 'Neue Nationalgalerie',
    description: 'Musée d\'art moderne dans un bâtiment Mies van der Rohe',
    category: 'culture',
    price: 14,
    address: 'Potsdamer Straße 50, 10785 Berlin',
    imageUrl: '/images/activities/neue.jpg',
    city: 'berlin',
    price_range: '14€'
  },
  {
    id: 'b-cult-5',
    title: 'Reichstag',
    description: 'Parlement allemand avec coupole en verre',
    category: 'culture',
    price: 0,
    address: 'Platz der Republik 1, 11011 Berlin',
    imageUrl: '/images/activities/reichstag.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },

  // Gastronomie Berlin
  {
    id: 'b-gast-1',
    title: 'Markthalle Neun',
    description: 'Marché couvert historique avec événements culinaires',
    category: 'gastronomie',
    price: 0,
    address: 'Eisenbahnstraße 42/43, 10997 Berlin',
    imageUrl: '/images/activities/markthalle.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },
  {
    id: 'b-gast-2',
    title: 'Restaurant Tim Raue',
    description: 'Restaurant 2 étoiles Michelin fusion asiatique',
    category: 'gastronomie',
    price: 198,
    address: 'Rudi-Dutschke-Straße 26, 10969 Berlin',
    imageUrl: '/images/activities/raue.jpg',
    city: 'berlin',
    price_range: '198€'
  },
  {
    id: 'b-gast-3',
    title: 'Mustafas Gemüse Kebap',
    description: 'Le meilleur kebab de Berlin',
    category: 'gastronomie',
    price: 5,
    address: 'Mehringdamm 32, 10961 Berlin',
    imageUrl: '/images/activities/mustafas.jpg',
    city: 'berlin',
    price_range: '5€'
  },
  {
    id: 'b-gast-4',
    title: 'Curry 36',
    description: 'Institution du currywurst berlinois',
    category: 'gastronomie',
    price: 4,
    address: 'Mehringdamm 36, 10961 Berlin',
    imageUrl: '/images/activities/curry36.jpg',
    city: 'berlin',
    price_range: '4€'
  },
  {
    id: 'b-gast-5',
    title: 'CODA Dessert Bar',
    description: 'Bar à desserts étoilé Michelin',
    category: 'gastronomie',
    price: 128,
    address: 'Friedelstraße 47, 12047 Berlin',
    imageUrl: '/images/activities/coda.jpg',
    city: 'berlin',
    price_range: '128€'
  },

  // Vie Nocturne Berlin
  {
    id: 'b-nuit-1',
    title: 'Berghain',
    description: 'Club techno légendaire',
    category: 'vie nocturne',
    price: 20,
    address: 'Am Wriezener Bahnhof, 10243 Berlin',
    imageUrl: '/images/activities/berghain.jpg',
    city: 'berlin',
    price_range: '20€'
  },
  {
    id: 'b-nuit-2',
    title: 'Klunkerkranich',
    description: 'Bar sur le toit avec vue panoramique',
    category: 'vie nocturne',
    price: 5,
    address: 'Karl-Marx-Straße 66, 12043 Berlin',
    imageUrl: '/images/activities/klunkerkranich.jpg',
    city: 'berlin',
    price_range: '5€'
  },
  {
    id: 'b-nuit-3',
    title: 'Prater Biergarten',
    description: 'Plus vieux biergarten de Berlin',
    category: 'vie nocturne',
    price: 0,
    address: 'Kastanienallee 7-9, 10435 Berlin',
    imageUrl: '/images/activities/prater.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },
  {
    id: 'b-nuit-4',
    title: 'Watergate',
    description: 'Club électro avec vue sur la Spree',
    category: 'vie nocturne',
    price: 15,
    address: 'Falckensteinstraße 49, 10997 Berlin',
    imageUrl: '/images/activities/watergate.jpg',
    city: 'berlin',
    price_range: '15€'
  },
  {
    id: 'b-nuit-5',
    title: 'Monkey Bar',
    description: 'Bar panoramique branché',
    category: 'vie nocturne',
    price: 0,
    address: 'Budapester Str. 40, 10787 Berlin',
    imageUrl: '/images/activities/monkey-bar.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },

  // Sport Berlin
  {
    id: 'b-sport-1',
    title: 'Olympiastadion',
    description: 'Stade olympique historique de 1936',
    category: 'sport',
    price: 8,
    address: 'Olympischer Platz 3, 14053 Berlin',
    imageUrl: '/images/activities/olympiastadion.jpg',
    city: 'berlin',
    price_range: '8€'
  },
  {
    id: 'b-sport-2',
    title: 'Badeschiff',
    description: 'Piscine flottante sur la Spree',
    category: 'sport',
    price: 8,
    address: 'Eichenstraße 4, 12435 Berlin',
    imageUrl: '/images/activities/badeschiff.jpg',
    city: 'berlin',
    price_range: '8€'
  },
  {
    id: 'b-sport-3',
    title: 'Tempelhofer Feld',
    description: 'Ancien aéroport transformé en parc de loisirs',
    category: 'sport',
    price: 0,
    address: 'Tempelhofer Damm, 12101 Berlin',
    imageUrl: '/images/activities/tempelhof.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },
  {
    id: 'b-sport-4',
    title: 'Velodrom',
    description: 'Vélodrome olympique couvert',
    category: 'sport',
    price: 12,
    address: 'Paul-Heyse-Straße 26, 10407 Berlin',
    imageUrl: '/images/activities/velodrom.jpg',
    city: 'berlin',
    price_range: '12€'
  },
  {
    id: 'b-sport-5',
    title: 'Kletterwerk',
    description: 'Plus grande salle d\'escalade de Berlin',
    category: 'sport',
    price: 15,
    address: 'Swinemünder Str. 45, 13355 Berlin',
    imageUrl: '/images/activities/kletterwerk.jpg',
    city: 'berlin',
    price_range: '15€'
  },

  // Nature Berlin
  {
    id: 'b-nat-1',
    title: 'Tiergarten',
    description: 'Plus grand parc du centre de Berlin',
    category: 'nature',
    price: 0,
    address: 'Straße des 17. Juni 100, 10557 Berlin',
    imageUrl: '/images/activities/tiergarten.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },
  {
    id: 'b-nat-2',
    title: 'Jardin botanique',
    description: 'Un des plus grands jardins botaniques du monde',
    category: 'nature',
    price: 6,
    address: 'Königin-Luise-Straße 6-8, 14195 Berlin',
    imageUrl: '/images/activities/botanischer.jpg',
    city: 'berlin',
    price_range: '6€'
  },
  {
    id: 'b-nat-3',
    title: 'Treptower Park',
    description: 'Grand parc au bord de la Spree',
    category: 'nature',
    price: 0,
    address: 'Alt-Treptow, 12435 Berlin',
    imageUrl: '/images/activities/treptower.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },
  {
    id: 'b-nat-4',
    title: 'Pfaueninsel',
    description: 'Île aux paons avec château romantique',
    category: 'nature',
    price: 4,
    address: 'Nikolskoer Weg, 14109 Berlin',
    imageUrl: '/images/activities/pfaueninsel.jpg',
    city: 'berlin',
    price_range: '4€'
  },
  {
    id: 'b-nat-5',
    title: 'Grunewald',
    description: 'Plus grande forêt de Berlin',
    category: 'nature',
    price: 0,
    address: 'Grunewald, 14193 Berlin',
    imageUrl: '/images/activities/grunewald.jpg',
    city: 'berlin',
    price_range: 'gratuit'
  },

  // Culture New York
  {
    id: 'ny-cult-1',
    title: 'MoMA',
    description: 'Musée d\'Art Moderne de New York',
    category: 'culture',
    price: 25,
    address: '11 W 53rd St, New York, NY 10019',
    imageUrl: '/images/activities/moma.jpg',
    city: 'newyork',
    price_range: '25€'
  },
  {
    id: 'ny-cult-2',
    title: 'Metropolitan Museum',
    description: 'Plus grand musée d\'art des États-Unis',
    category: 'culture',
    price: 25,
    address: '1000 5th Ave, New York, NY 10028',
    imageUrl: '/images/activities/met.jpg',
    city: 'newyork',
    price_range: '25€'
  },
  {
    id: 'ny-cult-3',
    title: 'Broadway Show',
    description: 'Spectacle musical à Broadway',
    category: 'culture',
    price: 89,
    address: 'Broadway, New York, NY',
    imageUrl: '/images/activities/broadway.jpg',
    city: 'newyork',
    price_range: '89€'
  },
  {
    id: 'ny-cult-4',
    title: 'Guggenheim Museum',
    description: 'Musée d\'art moderne dans un bâtiment Frank Lloyd Wright',
    category: 'culture',
    price: 25,
    address: '1071 5th Ave, New York, NY 10128',
    imageUrl: '/images/activities/guggenheim.jpg',
    city: 'newyork',
    price_range: '25€'
  },
  {
    id: 'ny-cult-5',
    title: 'Whitney Museum',
    description: 'Musée d\'art américain',
    category: 'culture',
    price: 25,
    address: '99 Gansevoort St, New York, NY 10014',
    imageUrl: '/images/activities/whitney.jpg',
    city: 'newyork',
    price_range: '25€'
  },

  // Gastronomie New York
  {
    id: 'ny-gast-1',
    title: 'Katz\'s Delicatessen',
    description: 'Institution du sandwich pastrami',
    category: 'gastronomie',
    price: 25,
    address: '205 E Houston St, New York, NY 10002',
    imageUrl: '/images/activities/katz.jpg',
    city: 'newyork',
    price_range: '25€'
  },
  {
    id: 'ny-gast-2',
    title: 'Le Bernardin',
    description: 'Restaurant 3 étoiles Michelin de fruits de mer',
    category: 'gastronomie',
    price: 275,
    address: '155 W 51st St, New York, NY 10019',
    imageUrl: '/images/activities/bernardin.jpg',
    city: 'newyork',
    price_range: '275€'
  },
  {
    id: 'ny-gast-3',
    title: 'Chelsea Market',
    description: 'Marché gastronomique couvert',
    category: 'gastronomie',
    price: 0,
    address: '75 9th Ave, New York, NY 10011',
    imageUrl: '/images/activities/chelsea-market.jpg',
    city: 'newyork',
    price_range: 'gratuit'
  },
  {
    id: 'ny-gast-4',
    title: 'Grimaldi\'s Pizza',
    description: 'Pizza napolitaine légendaire de Brooklyn',
    category: 'gastronomie',
    price: 20,
    address: '1 Front St, Brooklyn, NY 11201',
    imageUrl: '/images/activities/grimaldis.jpg',
    city: 'newyork',
    price_range: '20€'
  },
  {
    id: 'ny-gast-5',
    title: 'Eataly NYC',
    description: 'Marché italien gastronomique',
    category: 'gastronomie',
    price: 0,
    address: '200 5th Ave, New York, NY 10010',
    imageUrl: '/images/activities/eataly.jpg',
    city: 'newyork',
    price_range: 'gratuit'
  },

  // Vie Nocturne New York
  {
    id: 'ny-nuit-1',
    title: 'Rooftop 230 Fifth',
    description: 'Bar sur le toit avec vue sur l\'Empire State Building',
    category: 'vie nocturne',
    price: 0,
    address: '230 5th Ave, New York, NY 10001',
    imageUrl: '/images/activities/230fifth.jpg',
    city: 'newyork',
    price_range: 'gratuit'
  },
  {
    id: 'ny-nuit-2',
    title: 'Blue Note Jazz Club',
    description: 'Club de jazz légendaire',
    category: 'vie nocturne',
    price: 45,
    address: '131 W 3rd St, New York, NY 10012',
    imageUrl: '/images/activities/blue-note.jpg',
    city: 'newyork',
    price_range: '45€'
  },
  {
    id: 'ny-nuit-3',
    title: 'House of Yes',
    description: 'Club alternatif et espace créatif',
    category: 'vie nocturne',
    price: 30,
    address: '2 Wyckoff Ave, Brooklyn, NY 11237',
    imageUrl: '/images/activities/house-yes.jpg',
    city: 'newyork',
    price_range: '30€'
  },
  {
    id: 'ny-nuit-4',
    title: 'PDT (Please Don\'t Tell)',
    description: 'Speakeasy caché derrière un hot-dog shop',
    category: 'vie nocturne',
    price: 15,
    address: '113 St Marks Pl, New York, NY 10009',
    imageUrl: '/images/activities/pdt.jpg',
    city: 'newyork',
    price_range: '15€'
  },
  {
    id: 'ny-nuit-5',
    title: 'Brooklyn Bowl',
    description: 'Bowling, concerts live et restaurant',
    category: 'vie nocturne',
    price: 25,
    address: '61 Wythe Ave, Brooklyn, NY 11249',
    imageUrl: '/images/activities/brooklyn-bowl.jpg',
    city: 'newyork',
    price_range: '25€'
  },

  // Sport New York
  {
    id: 'ny-sport-1',
    title: 'Match NBA au Madison Square Garden',
    description: 'Match des New York Knicks',
    category: 'sport',
    price: 75,
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    imageUrl: '/images/activities/msg.jpg',
    city: 'newyork',
    price_range: '75€'
  },
  {
    id: 'ny-sport-2',
    title: 'Match MLB au Yankee Stadium',
    description: 'Match des New York Yankees',
    category: 'sport',
    price: 30,
    address: '1 E 161 St, The Bronx, NY 10451',
    imageUrl: '/images/activities/yankees.jpg',
    city: 'newyork',
    price_range: '30€'
  },
  {
    id: 'ny-sport-3',
    title: 'Vélo dans Central Park',
    description: 'Location de vélo et tour du parc',
    category: 'sport',
    price: 15,
    address: 'Central Park, New York, NY',
    imageUrl: '/images/activities/central-park-bike.jpg',
    city: 'newyork',
    price_range: '15€'
  },
  {
    id: 'ny-sport-4',
    title: 'Chelsea Piers',
    description: 'Complexe sportif au bord de l\'Hudson',
    category: 'sport',
    price: 60,
    address: '62 Chelsea Piers, New York, NY 10011',
    imageUrl: '/images/activities/chelsea-piers.jpg',
    city: 'newyork',
    price_range: '60€'
  },
  {
    id: 'ny-sport-5',
    title: 'Brooklyn Boulders',
    description: 'Salle d\'escalade urbaine',
    category: 'sport',
    price: 32,
    address: '575 Degraw St, Brooklyn, NY 11217',
    imageUrl: '/images/activities/brooklyn-boulders.jpg',
    city: 'newyork',
    price_range: '32€'
  },

  // Nature New York
  {
    id: 'ny-nat-1',
    title: 'Central Park',
    description: 'Poumon vert de Manhattan',
    category: 'nature',
    price: 0,
    address: 'Central Park, New York, NY',
    imageUrl: '/images/activities/central-park.jpg',
    city: 'newyork',
    price_range: 'gratuit'
  },
  {
    id: 'ny-nat-2',
    title: 'Brooklyn Botanic Garden',
    description: 'Jardin botanique avec cerisiers japonais',
    category: 'nature',
    price: 15,
    address: '990 Washington Ave, Brooklyn, NY 11225',
    imageUrl: '/images/activities/bbg.jpg',
    city: 'newyork',
    price_range: '15€'
  },
  {
    id: 'ny-nat-3',
    title: 'High Line',
    description: 'Parc linéaire sur une ancienne voie ferrée',
    category: 'nature',
    price: 0,
    address: 'High Line, New York, NY 10011',
    imageUrl: '/images/activities/high-line.jpg',
    city: 'newyork',
    price_range: 'gratuit'
  },
  {
    id: 'ny-nat-4',
    title: 'Prospect Park',
    description: 'Grand parc de Brooklyn',
    category: 'nature',
    price: 0,
    address: 'Prospect Park, Brooklyn, NY',
    imageUrl: '/images/activities/prospect-park.jpg',
    city: 'newyork',
    price_range: 'gratuit'
  },
  {
    id: 'ny-nat-5',
    title: 'New York Botanical Garden',
    description: 'Jardin botanique historique du Bronx',
    category: 'nature',
    price: 15,
    address: '2900 Southern Blvd, Bronx, NY 10458',
    imageUrl: '/images/activities/nybg.jpg',
    city: 'newyork',
    price_range: '15€'
  },

  // Culture Bruxelles
  {
    id: 'bx-cult-1',
    title: 'Atomium',
    description: 'Monument emblématique de l\'Expo 58',
    category: 'culture',
    price: 16,
    address: 'Place de l\'Atomium 1, 1020 Bruxelles',
    imageUrl: '/images/activities/atomium.jpg',
    city: 'bruxelles',
    price_range: '16€'
  },
  {
    id: 'bx-cult-2',
    title: 'Musées Royaux des Beaux-Arts',
    description: 'Collection d\'art ancien et moderne',
    category: 'culture',
    price: 10,
    address: 'Rue de la Régence 3, 1000 Bruxelles',
    imageUrl: '/images/activities/beaux-arts.jpg',
    city: 'bruxelles',
    price_range: '10€'
  },
  {
    id: 'bx-cult-3',
    title: 'Centre Belge de la Bande Dessinée',
    description: 'Musée de la BD dans un bâtiment Art nouveau',
    category: 'culture',
    price: 12,
    address: 'Rue des Sables 20, 1000 Bruxelles',
    imageUrl: '/images/activities/cbbd.jpg',
    city: 'bruxelles',
    price_range: '12€'
  },
  {
    id: 'bx-cult-4',
    title: 'Mini-Europe',
    description: 'Parc de miniatures des monuments européens',
    category: 'culture',
    price: 17,
    address: 'Avenue du Football 1, 1020 Bruxelles',
    imageUrl: '/images/activities/mini-europe.jpg',
    city: 'bruxelles',
    price_range: '17€'
  },
  {
    id: 'bx-cult-5',
    title: 'Maison Horta',
    description: 'Chef-d\'œuvre de l\'Art nouveau',
    category: 'culture',
    price: 12,
    address: 'Rue Américaine 25, 1060 Bruxelles',
    imageUrl: '/images/activities/horta.jpg',
    city: 'bruxelles',
    price_range: '12€'
  },

  // Gastronomie Bruxelles
  {
    id: 'bx-gast-1',
    title: 'Comme Chez Soi',
    description: 'Restaurant 2 étoiles Michelin historique',
    category: 'gastronomie',
    price: 175,
    address: 'Place Rouppe 23, 1000 Bruxelles',
    imageUrl: '/images/activities/comme-chez-soi.jpg',
    city: 'bruxelles',
    price_range: '175€'
  },
  {
    id: 'bx-gast-2',
    title: 'Maison Antoine',
    description: 'Meilleures frites de Bruxelles',
    category: 'gastronomie',
    price: 5,
    address: 'Place Jourdan 1, 1040 Bruxelles',
    imageUrl: '/images/activities/antoine.jpg',
    city: 'bruxelles',
    price_range: '5€'
  },
  {
    id: 'bx-gast-3',
    title: 'Aux Armes de Bruxelles',
    description: 'Restaurant traditionnel bruxellois',
    category: 'gastronomie',
    price: 50,
    address: 'Rue des Bouchers 13, 1000 Bruxelles',
    imageUrl: '/images/activities/armes.jpg',
    city: 'bruxelles',
    price_range: '50€'
  },
  {
    id: 'bx-gast-4',
    title: 'Marché des Abattoirs',
    description: 'Plus grand marché de Bruxelles',
    category: 'gastronomie',
    price: 0,
    address: 'Rue Ropsy Chaudron 24, 1070 Bruxelles',
    imageUrl: '/images/activities/abattoirs.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },
  {
    id: 'bx-gast-5',
    title: 'Delirium Café',
    description: 'Bar avec plus de 2000 bières',
    category: 'gastronomie',
    price: 5,
    address: 'Impasse de la Fidélité 4, 1000 Bruxelles',
    imageUrl: '/images/activities/delirium.jpg',
    city: 'bruxelles',
    price_range: '5€'
  },

  // Vie Nocturne Bruxelles
  {
    id: 'bx-nuit-1',
    title: 'Fuse',
    description: 'Club techno emblématique',
    category: 'vie nocturne',
    price: 15,
    address: 'Rue Blaes 208, 1000 Bruxelles',
    imageUrl: '/images/activities/fuse.jpg',
    city: 'bruxelles',
    price_range: '15€'
  },
  {
    id: 'bx-nuit-2',
    title: 'Place Saint-Géry',
    description: 'Place animée avec bars',
    category: 'vie nocturne',
    price: 0,
    address: 'Place Saint-Géry, 1000 Bruxelles',
    imageUrl: '/images/activities/saint-gery.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },
  {
    id: 'bx-nuit-3',
    title: 'L\'Archiduc',
    description: 'Bar jazz Art déco',
    category: 'vie nocturne',
    price: 10,
    address: 'Rue Antoine Dansaert 6, 1000 Bruxelles',
    imageUrl: '/images/activities/archiduc.jpg',
    city: 'bruxelles',
    price_range: '10€'
  },
  {
    id: 'bx-nuit-4',
    title: 'Café Floréo',
    description: 'Bar branché avec terrasse',
    category: 'vie nocturne',
    price: 0,
    address: 'Avenue Louise 92, 1050 Bruxelles',
    imageUrl: '/images/activities/floreo.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },
  {
    id: 'bx-nuit-5',
    title: 'Le You',
    description: 'Club avec rooftop',
    category: 'vie nocturne',
    price: 15,
    address: 'Avenue Louise 315, 1050 Bruxelles',
    imageUrl: '/images/activities/you.jpg',
    city: 'bruxelles',
    price_range: '15€'
  },

  // Sport Bruxelles
  {
    id: 'bx-sport-1',
    title: 'Stade Roi Baudouin',
    description: 'Stade national de Belgique',
    category: 'sport',
    price: 10,
    address: 'Avenue de Marathon 135, 1020 Bruxelles',
    imageUrl: '/images/activities/baudouin.jpg',
    city: 'bruxelles',
    price_range: '10€'
  },
  {
    id: 'bx-sport-2',
    title: 'Villo!',
    description: 'Location de vélos en libre-service',
    category: 'sport',
    price: 1.60,
    address: 'Stations partout dans Bruxelles',
    imageUrl: '/images/activities/villo.jpg',
    city: 'bruxelles',
    price_range: '1.60€'
  },
  {
    id: 'bx-sport-3',
    title: 'Complexe Sportif Poseidon',
    description: 'Centre aquatique avec piscine olympique',
    category: 'sport',
    price: 5,
    address: 'Avenue des Vaillants 2, 1200 Bruxelles',
    imageUrl: '/images/activities/poseidon.jpg',
    city: 'bruxelles',
    price_range: '5€'
  },
  {
    id: 'bx-sport-4',
    title: 'Basic-Fit Premium',
    description: 'Salle de sport moderne',
    category: 'sport',
    price: 30,
    address: 'Rue Neuve 123, 1000 Bruxelles',
    imageUrl: '/images/activities/basic-fit.jpg',
    city: 'bruxelles',
    price_range: '30€'
  },
  {
    id: 'bx-sport-5',
    title: 'Promenade Verte',
    description: 'Circuit pédestre et cyclable de 60km',
    category: 'sport',
    price: 0,
    address: 'Bruxelles',
    imageUrl: '/images/activities/promenade-verte.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },

  // Nature Bruxelles
  {
    id: 'bx-nat-1',
    title: 'Bois de la Cambre',
    description: 'Grand parc boisé au sud de Bruxelles',
    category: 'nature',
    price: 0,
    address: 'Bois de la Cambre, 1000 Bruxelles',
    imageUrl: '/images/activities/cambre.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },
  {
    id: 'bx-nat-2',
    title: 'Jardin Botanique de Meise',
    description: 'Un des plus grands jardins botaniques du monde',
    category: 'nature',
    price: 7,
    address: 'Nieuwelaan 38, 1860 Meise',
    imageUrl: '/images/activities/meise.jpg',
    city: 'bruxelles',
    price_range: '7€'
  },
  {
    id: 'bx-nat-3',
    title: 'Parc du Cinquantenaire',
    description: 'Parc historique avec monuments',
    category: 'nature',
    price: 0,
    address: 'Parc du Cinquantenaire, 1000 Bruxelles',
    imageUrl: '/images/activities/cinquantenaire.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },
  {
    id: 'bx-nat-4',
    title: 'Forêt de Soignes',
    description: 'Vaste forêt aux portes de Bruxelles',
    category: 'nature',
    price: 0,
    address: 'Forêt de Soignes, 1160 Bruxelles',
    imageUrl: '/images/activities/soignes.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  },
  {
    id: 'bx-nat-5',
    title: 'Parc Josaphat',
    description: 'Parc paysager avec étangs',
    category: 'nature',
    price: 0,
    address: 'Avenue des Azalées, 1030 Bruxelles',
    imageUrl: '/images/activities/josaphat.jpg',
    city: 'bruxelles',
    price_range: 'gratuit'
  }
] 