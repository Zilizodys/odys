import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Program } from '@/types/program';
import { Activity } from '@/types/activity';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Récupérer le programme avec tous les champs
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (programError) {
      console.error('Erreur Supabase:', programError);
      return NextResponse.json(
        { 
          success: false,
          error: programError.message 
        },
        { status: programError.code === 'PGRST116' ? 404 : 500 }
      );
    }

    if (!program) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Programme non trouvé' 
        },
        { status: 404 }
      );
    }

    // Récupérer les activités liées au programme
    const { data: programActivities, error: activitiesError } = await supabase
      .from('program_activities')
      .select(`
        activity_id,
        order_index,
        activities (
          id,
          title,
          description,
          price,
          address,
          imageurl,
          category,
          city
        )
      `)
      .eq('program_id', params.id)
      .order('order_index');

    if (activitiesError) {
      console.error('Erreur lors de la récupération des activités:', activitiesError);
      return NextResponse.json(
        { 
          success: false,
          error: activitiesError.message 
        },
        { status: 500 }
      );
    }

    // Transformer les activités en format attendu
    const activities: Activity[] = programActivities
      ? programActivities.map((pa: any) => ({
          id: pa.activities.id,
          title: pa.activities.title,
          description: pa.activities.description,
          price: pa.activities.price,
          address: pa.activities.address,
          imageurl: pa.activities.imageurl,
          category: pa.activities.category,
          city: pa.activities.city
        }))
      : [];

    // Vérifier les champs requis
    if (!program.destination || !program.start_date || !program.end_date || !program.budget || !program.companion) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Données du programme incomplètes' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...program,
        activities
      }
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur serveur interne' 
      },
      { status: 500 }
    );
  }
} 