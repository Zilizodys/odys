import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

// Configuration
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const IMAGE_QUALITY = 80;
const IMAGE_WIDTH = 800;
const WEBP_QUALITY = 75;

async function optimizeImage(inputPath: string, outputPath: string) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Déterminer les dimensions optimales
    const width = metadata.width && metadata.width > IMAGE_WIDTH ? IMAGE_WIDTH : metadata.width;
    
    // Optimiser l'image
    await image
      .resize(width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ 
        quality: IMAGE_QUALITY,
        mozjpeg: true // Utiliser mozjpeg pour une meilleure compression
      })
      .toFile(outputPath);

    // Créer une version WebP
    const webpPath = outputPath.replace('.jpg', '.webp');
    await image
      .webp({ 
        quality: WEBP_QUALITY,
        effort: 6 // Niveau d'effort de compression (0-6)
      })
      .toFile(webpPath);

    return true;
  } catch (error) {
    console.error(`Erreur lors de l'optimisation de l'image ${inputPath}:`, error);
    return false;
  }
}

async function main() {
  try {
    // Initialiser le client Supabase avec un pool de connexions
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        },
        db: {
          schema: 'public'
        }
      }
    );

    // Récupérer toutes les activités
    const { data: activities, error } = await supabase
      .from('activities')
      .select('id, imageurl')
      .limit(1000);

    if (error) {
      throw error;
    }

    if (!activities || activities.length === 0) {
      console.log('Aucune activité trouvée');
      return;
    }

    console.log(`${activities.length} activités trouvées`);

    // Lire le contenu du dossier des images
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'activities');
    const optimizedDir = path.join(imagesDir, 'optimized');
    
    // Créer le dossier optimized s'il n'existe pas
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true });
    }

    const files = fs.readdirSync(imagesDir)
      .filter(file => file !== 'Mascot.png' && file.endsWith('.jpg'));

    console.log(`${files.length} images trouvées dans le dossier`);

    // Optimiser les images
    for (const file of files) {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(optimizedDir, file);
      
      // Vérifier si l'image optimisée existe déjà
      if (!fs.existsSync(outputPath)) {
        const stats = fs.statSync(inputPath);
        if (stats.size > MAX_IMAGE_SIZE) {
          await optimizeImage(inputPath, outputPath);
        } else {
          fs.copyFileSync(inputPath, outputPath);
        }
      }
    }

    // Mettre à jour chaque activité avec une image optimisée
    for (const activity of activities) {
      const randomImage = files[Math.floor(Math.random() * files.length)];
      const newImageUrl = `/images/activities/optimized/${randomImage}`;

      const { error: updateError } = await supabase
        .from('activities')
        .update({ imageurl: newImageUrl })
        .eq('id', activity.id);

      if (updateError) {
        console.error(`Erreur lors de la mise à jour de l'activité ${activity.id}:`, updateError);
        continue;
      }

      console.log(`Activité ${activity.id} mise à jour avec l'image ${randomImage}`);
    }

    console.log('Mise à jour terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des images:', error);
    process.exit(1);
  }
}

main(); 