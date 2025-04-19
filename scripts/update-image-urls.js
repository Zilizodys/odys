require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key are required in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Récupérer toutes les activités
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*');

    if (error) throw error;

    // Lire le contenu du dossier des images
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'activities');
    const files = fs.readdirSync(imagesDir);

    console.log(`Found ${files.length} images in directory`);
    console.log(`Found ${activities.length} activities in database`);

    // Pour chaque activité, assigner une image aléatoire
    for (const activity of activities) {
      // Sélectionner une image aléatoire
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const imageUrl = `/images/activities/${randomFile}`;

      // Mettre à jour l'URL de l'image dans la base de données
      const { error: updateError } = await supabase
        .from('activities')
        .update({ imageurl: imageUrl })
        .eq('id', activity.id);

      if (updateError) {
        console.error(`Error updating activity ${activity.id}:`, updateError);
        continue;
      }

      console.log(`Updated activity ${activity.id} with image ${imageUrl}`);
    }

    console.log('Image URLs update completed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 