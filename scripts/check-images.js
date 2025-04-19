require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key are required in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('id, title, imageurl');

    if (error) throw error;

    console.log(`Total activities: ${activities.length}`);
    console.log('\nActivities with missing or invalid imageurl:');
    
    let missingCount = 0;
    let validCount = 0;

    activities.forEach(activity => {
      if (!activity.imageurl) {
        console.log(`- ${activity.title} (ID: ${activity.id}): No imageurl`);
        missingCount++;
      } else {
        validCount++;
      }
    });

    console.log('\nSummary:');
    console.log(`Total activities: ${activities.length}`);
    console.log(`Activities with valid imageurl: ${validCount}`);
    console.log(`Activities with missing imageurl: ${missingCount}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 