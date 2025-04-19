require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const https = require('https');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key are required in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour télécharger une image avec retry
async function downloadImage(url, filepath, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(fs.createWriteStream(filepath))
              .on('error', reject)
              .once('close', () => resolve(filepath));
          } else {
            response.resume();
            reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
          }
        }).on('error', reject);
      });
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} for ${filepath}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Fonction pour obtenir une image depuis Unsplash avec retry
async function getUnsplashImage(query, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.urls || !data.urls.regular) {
        throw new Error('Invalid response from Unsplash API');
      }
      
      return data.urls.regular;
    } catch (error) {
      if (i === retries - 1) throw error;
      if (error.message.includes('429')) {
        console.log('Rate limit reached, waiting for 1 hour...');
        await new Promise(resolve => setTimeout(resolve, 3600000));
      } else {
        console.log(`Retry ${i + 1}/${retries} for query: ${query}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
}

// Fonction principale
async function main() {
  try {
    // Récupérer toutes les activités depuis Supabase
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*');

    if (error) throw error;

    console.log(`Total activities found: ${activities.length}`);

    // Créer le dossier s'il n'existe pas
    const imageDir = path.join(process.cwd(), 'public', 'images', 'activities');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    // Télécharger une image pour chaque activité
    let successCount = 0;
    let failureCount = 0;
    const failedActivities = [];

    for (const activity of activities) {
      try {
        const query = `${activity.title} ${activity.category} ${activity.city}`;
        console.log(`\nProcessing activity: ${activity.title}`);
        console.log(`Current imageUrl: ${activity.imageUrl}`);
        
        // Vérifier si l'image existe déjà
        const filename = `${activity.id}.jpg`;
        const filepath = path.join(imageDir, filename);
        
        if (fs.existsSync(filepath)) {
          console.log(`Image already exists for ${activity.title}, skipping...`);
          successCount++;
          continue;
        }

        console.log(`Downloading new image for ${activity.title}...`);
        const imageUrl = await getUnsplashImage(query);
        console.log(`Got Unsplash URL: ${imageUrl}`);
        
        await downloadImage(imageUrl, filepath);
        console.log(`Downloaded image to ${filepath}`);
        
        // Mettre à jour l'URL de l'image dans la base de données
        const imageUrlInDb = `/images/activities/${filename}`;
        console.log(`Updating database with URL: ${imageUrlInDb}`);
        
        const { error: updateError } = await supabase
          .from('activities')
          .update({ imageurl: imageUrlInDb })
          .eq('id', activity.id);

        if (updateError) {
          console.error(`Database update error:`, updateError);
          throw updateError;
        }

        console.log(`Successfully processed ${activity.title}`);
        successCount++;
      } catch (error) {
        console.error(`Failed to process ${activity.title}:`, error.message);
        failureCount++;
        failedActivities.push({
          id: activity.id,
          title: activity.title,
          error: error.message
        });
      }
    }

    console.log('\nDownload Summary:');
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    
    if (failedActivities.length > 0) {
      console.log('\nFailed Activities:');
      failedActivities.forEach(activity => {
        console.log(`- ${activity.title}: ${activity.error}`);
      });
    }

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main(); 