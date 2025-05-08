require('dotenv').config();
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Dictionnaire de codes postaux pour les grandes villes françaises
const cityPostalCodes = {
  'paris': '75001',
  'lyon': '69001',
  'marseille': '13001',
  'toulouse': '31000',
  'nantes': '44000',
  'bordeaux': '33000',
  'lille': '59000',
  'strasbourg': '67000',
  'nice': '06000',
  'rennes': '35000',
  'montpellier': '34000',
  'toulon': '83000',
  'angers': '49000',
  'dijon': '21000',
  'grenoble': '38000',
  'saint-etienne': '42000',
  'le havre': '76600',
  'reims': '51100',
  'clermont-ferrand': '63000',
  'brest': '29200',
  'limoges': '87000',
  'amiens': '80000',
  'metz': '57000',
  'perpignan': '66000',
  'besançon': '25000',
  'orleans': '45000',
  'rouen': '76000',
  'mulhouse': '68100',
  'caen': '14000',
  'boulogne-billancourt': '92100',
  'saint-denis': '93200',
  'argenteuil': '95100',
  'versailles': '78000'
};

// Adresses centrales pour les villes majeures (France et monde)
const cityCenters = {
  'paris': 'Place de l Hôtel de Ville',
  'lyon': 'Place Bellecour',
  'marseille': 'Vieux-Port',
  'toulouse': 'Capitole',
  'nantes': 'Place Royale',
  'bordeaux': 'Place de la Bourse',
  'lille': 'Grand Place',
  'strasbourg': 'Place Kléber',
  'nice': 'Place Masséna',
  'rennes': 'Place de la Mairie',
  'montpellier': 'Place de la Comédie',
  'new york': 'Times Square',
  'london': 'Trafalgar Square',
  'bruxelles': 'Grand-Place',
  'barcelona': 'Plaça de Catalunya',
  'rome': 'Piazza Venezia',
  'berlin': 'Alexanderplatz',
  'tokyo': 'Shibuya Crossing',
  'dubai': 'Burj Khalifa',
  'sydney': 'Sydney Opera House',
};

function formatAddressForCountry(address, city, country) {
  let formattedAddress = address.trim();
  
  // Règles spécifiques par pays
  switch(country.toLowerCase()) {
    case 'france':
      // Format français : numéro rue, code postal ville
      formattedAddress = formattedAddress.replace(/(\d+)\s*(bis|ter|quater)/gi, '$1$2');
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
      break;
      
    case 'united kingdom':
    case 'uk':
      // Format UK : numéro rue, ville, code postal
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
      break;
      
    case 'united states':
    case 'usa':
      // Format US : numéro rue, ville, état code postal
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
      break;
      
    case 'japan':
      // Format japonais : préfecture, ville, quartier, numéro
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
      break;
      
    case 'united arab emirates':
    case 'uae':
      // Format UAE : zone, ville, pays
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
      break;
      
    case 'australia':
      // Format australien : numéro rue, ville état code postal
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
      break;
      
    default:
      // Format par défaut
      if (city && !formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        formattedAddress += `, ${city}`;
      }
  }
  
  // Ajoute le pays si pas déjà présent
  if (!formattedAddress.toLowerCase().includes(country.toLowerCase())) {
    formattedAddress += `, ${country}`;
  }
  
  // Nettoie les espaces et virgules multiples
  return formattedAddress
    .replace(/(,\s*)+/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/, $/, '')
    .trim();
}

async function geocodeAddress(address) {
  try {
    console.log(`\nTentative de géocodage pour: ${address}`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'contact@odysway.com',
        'Accept-Language': 'fr,en'
      }
    });
    
    if (!res.ok) {
      console.error(`Erreur HTTP: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    
    // Si pas de résultat, essaie sans le pays
    const addressWithoutCountry = address.split(',').slice(0, -1).join(',').trim();
    if (addressWithoutCountry) {
      console.log(`Tentative sans pays: ${addressWithoutCountry}`);
      const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressWithoutCountry)}`;
      const res2 = await fetch(url2, {
        headers: { 
          'User-Agent': 'contact@odysway.com',
          'Accept-Language': 'fr,en'
        }
      });
      
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.length > 0) {
          return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors du géocodage: ${error.message}`);
    return null;
  }
}

function getCountryForCity(city) {
  if (!city) return 'France';
  const c = city.trim().toLowerCase();
  if (['paris', 'lyon', 'marseille', 'toulouse', 'nantes', 'bordeaux', 'lille', 'strasbourg', 'nice', 'rennes', 'montpellier', 'toulon', 'angers', 'dijon', 'grenoble', 'saint-etienne', 'le havre', 'reims', 'clermont-ferrand', 'brest', 'limoges', 'amiens', 'metz', 'perpignan', 'besançon', 'orleans', 'rouen', 'mulhouse', 'caen', 'boulogne-billancourt', 'saint-denis', 'argenteuil', 'versailles', 'paris  ', 'france'].includes(c)) return 'France';
  if (['rome', 'milano', 'milan', 'italy', 'italie', 'roma'].includes(c)) return 'Italy';
  if (['new york', 'new-york', 'nyc', 'united states', 'usa', 'etats-unis'].includes(c)) return 'United States';
  if (['london', 'londres', 'united kingdom', 'uk', 'angleterre'].includes(c)) return 'United Kingdom';
  if (['bruxelles', 'brussels', 'belgique', 'belgium'].includes(c)) return 'Belgium';
  if (['barcelone', 'barcelona', 'espagne', 'spain'].includes(c)) return 'Spain';
  if (['madere', 'madeira', 'funchal', 'portugal'].includes(c)) return 'Portugal';
  if (['istanbul', 'turquie', 'turkey'].includes(c)) return 'Turkey';
  if (['dubai', 'dubaï', 'emirats arabes unis', 'united arab emirates'].includes(c)) return 'United Arab Emirates';
  if (['rio de janeiro', 'brazil', 'brésil'].includes(c)) return 'Brazil';
  if (['sydney', 'australia', 'australie'].includes(c)) return 'Australia';
  return 'France';
}

function cleanAddress(address) {
  if (!address) return '';
  
  // Supprime les caractères spéciaux et les espaces multiples
  let cleaned = address
    .replace(/[^\w\s,.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  // Corrige les codes postaux français
  cleaned = cleaned.replace(/(\d{2})\s*(\d{3})/g, '$1$2');
  
  // Corrige les numéros de rue
  cleaned = cleaned.replace(/(\d+)\s*(bis|ter|quater)/gi, '$1$2');
  
  return cleaned;
}

function correctAddress(address, city) {
  if (!address) return '';
  
  let corrected = cleanAddress(address);
  
  // Ajoute des corrections spécifiques
  const corrections = {
    'paris': 'Paris',
    'lyon': 'Lyon',
    'marseille': 'Marseille',
    'toulouse': 'Toulouse',
    'nantes': 'Nantes',
    'bordeaux': 'Bordeaux',
    'lille': 'Lille',
    'strasbourg': 'Strasbourg',
    'nice': 'Nice',
    'rennes': 'Rennes',
    'montpellier': 'Montpellier',
    'toulon': 'Toulon',
    'angers': 'Angers',
    'dijon': 'Dijon',
    'grenoble': 'Grenoble',
    'saint-etienne': 'Saint-Étienne',
    'le havre': 'Le Havre',
    'reims': 'Reims',
    'clermont-ferrand': 'Clermont-Ferrand',
    'brest': 'Brest',
    'limoges': 'Limoges',
    'amiens': 'Amiens',
    'metz': 'Metz',
    'perpignan': 'Perpignan',
    'besançon': 'Besançon',
    'orleans': 'Orléans',
    'rouen': 'Rouen',
    'mulhouse': 'Mulhouse',
    'caen': 'Caen',
    'boulogne-billancourt': 'Boulogne-Billancourt',
    'saint-denis': 'Saint-Denis',
    'argenteuil': 'Argenteuil',
    'versailles': 'Versailles'
  };

  // Applique les corrections de ville
  if (city) {
    const cityLower = city.toLowerCase();
    if (corrections[cityLower]) {
      corrected = corrected.replace(new RegExp(cityLower, 'gi'), corrections[cityLower]);
    }
  }

  return corrected;
}

async function saveFailedAddresses(failedAddresses) {
  const filePath = path.join(__dirname, 'failed-addresses.json');
  await fs.promises.writeFile(filePath, JSON.stringify(failedAddresses, null, 2));
  console.log(`Adresses échouées sauvegardées dans ${filePath}`);
}

function isVagueAddress(address) {
  const vagueKeywords = [
    'centre-ville', 'centre ville', 'centre', 'downtown', 'city center',
    'port', 'quartier', 'district', 'neighborhood', 'area', 'zone', 'ville', 'city', 'centre', 'central', 'downtown', 'main square', 'place', 'plaza'
  ];
  const lower = address.toLowerCase();
  return vagueKeywords.some(k => lower.includes(k));
}

async function tryEnrichAndGeocode(activity, country) {
  let { address, city } = activity;
  let enrichedAddress = address;
  let cityKey = city ? city.trim().toLowerCase() : '';

  // Ajoute le code postal si manquant et connu
  if (country === 'France' && cityKey && cityPostalCodes[cityKey] && !address.match(/\d{5}/)) {
    enrichedAddress = `${address}, ${cityPostalCodes[cityKey]} ${city}`;
  }

  // Si l'adresse est trop vague, remplace par une adresse centrale
  if (isVagueAddress(address) && cityKey && cityCenters[cityKey]) {
    enrichedAddress = `${cityCenters[cityKey]}, ${city}`;
    if (country === 'France' && cityPostalCodes[cityKey]) {
      enrichedAddress += `, ${cityPostalCodes[cityKey]}`;
    }
  }

  // Reformate l'adresse
  const fullAddress = formatAddressForCountry(enrichedAddress, city, country);
  console.log(`Nouvelle tentative avec adresse enrichie: ${fullAddress}`);
  return await geocodeAddress(fullAddress);
}

async function main() {
  try {
    console.log('Démarrage du script de géocodage...');
    
    const { data: activities, error } = await supabase
      .from('activities')
      .select('id, address, city')
      .is('lat', null);

    if (error) {
      console.error('Erreur récupération activités:', error);
      return;
    }

    console.log(`Nombre d'activités à traiter: ${activities.length}`);

    const failedAddresses = [];

    for (const activity of activities) {
      try {
        console.log(`\n--- Traitement de l'activité ${activity.id} ---`);
        console.log(`Adresse originale: ${activity.address}`);
        console.log(`Ville originale: ${activity.city}`);

        const country = getCountryForCity(activity.city);
        const fullAddress = formatAddressForCountry(activity.address, activity.city, country);
        console.log(`Adresse formatée: ${fullAddress}`);
        
        const location = await geocodeAddress(fullAddress);
        
        if (location) {
          const { error: updateError } = await supabase
            .from('activities')
            .update({ lat: location.lat, lng: location.lng })
            .eq('id', activity.id);
            
          if (updateError) {
            console.error(`Erreur mise à jour Supabase: ${updateError.message}`);
            failedAddresses.push({
              id: activity.id,
              originalAddress: activity.address,
              originalCity: activity.city,
              formattedAddress: fullAddress,
              error: updateError.message
            });
          } else {
            console.log(`✅ Activité ${activity.id} géocodée : ${location.lat}, ${location.lng}`);
          }
        } else {
          // Tentative d'enrichissement automatique
          const enrichedLocation = await tryEnrichAndGeocode(activity, country);
          if (enrichedLocation) {
            const { error: updateError } = await supabase
              .from('activities')
              .update({ lat: enrichedLocation.lat, lng: enrichedLocation.lng })
              .eq('id', activity.id);
            if (updateError) {
              console.error(`Erreur mise à jour Supabase (enrichie): ${updateError.message}`);
              failedAddresses.push({
                id: activity.id,
                originalAddress: activity.address,
                originalCity: activity.city,
                formattedAddress: '[ENRICHED] ' + activity.address,
                error: updateError.message
              });
            } else {
              console.log(`✅ (Enrichie) Activité ${activity.id} géocodée : ${enrichedLocation.lat}, ${enrichedLocation.lng}`);
            }
          } else {
            console.warn(`❌ Géocodage échoué (après enrichissement) pour l'activité ${activity.id}`);
            failedAddresses.push({
              id: activity.id,
              originalAddress: activity.address,
              originalCity: activity.city,
              formattedAddress: '[ENRICHED] ' + activity.address
            });
          }
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de l'activité ${activity.id}: ${error.message}`);
        failedAddresses.push({
          id: activity.id,
          originalAddress: activity.address,
          originalCity: activity.city,
          error: error.message
        });
      }
      
      // Pause plus longue entre les requêtes
      await new Promise(r => setTimeout(r, 1000));
    }

    if (failedAddresses.length > 0) {
      await saveFailedAddresses(failedAddresses);
      console.log(`\n${failedAddresses.length} adresses n'ont pas pu être géocodées.`);
      console.log('Les adresses échouées ont été sauvegardées dans failed-addresses.json');
    }
  } catch (error) {
    console.error(`Erreur générale: ${error.message}`);
  }
}

main();