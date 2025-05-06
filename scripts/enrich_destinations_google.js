const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Remplace ces valeurs par tes vraies clés
const supabase = createClient('https://awpplalldxideqwgzjgf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHBsYWxsZHhpZGVxd2d6amdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUzNTM5MiwiZXhwIjoyMDYwMTExMzkyfQ.dhz57vk4naNczrg8XpTcg77G2qib9_R_Y8cew-0WOm8');

async function getPhotoReference(city) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(city)}&inputtype=textquery&fields=photos&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.candidates && data.candidates[0] && data.candidates[0].photos && data.candidates[0].photos[0]) {
    return data.candidates[0].photos[0].photo_reference;
  }
  return null;
}

async function updateCityPhoto(city) {
  const photoRef = await getPhotoReference(city);
  if (photoRef) {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
    await supabase.from('destinations').update({ imageurl: photoUrl }).eq('city', city);
    console.log(`Image ajoutée pour ${city} : ${photoUrl}`);
  } else {
    console.log(`Aucune image trouvée pour ${city}`);
  }
}

async function main() {
  // Récupère toutes les villes de la BDD
  const { data: destinations, error } = await supabase.from('destinations').select('city');
  if (error) {
    console.error('Erreur récupération destinations:', error);
    return;
  }
  if (!destinations) {
    console.log('Aucune destination trouvée.');
    return;
  }
  for (const dest of destinations) {
    if (dest.city) {
      await updateCityPhoto(dest.city);
      await new Promise(res => setTimeout(res, 1500)); // Pause pour éviter le rate limit
    }
  }
}

main();