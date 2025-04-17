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
    const { data: program, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du programme:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!program) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les champs requis
    if (!program.destination || !program.start_date || !program.end_date || !program.budget || !program.companion) {
      return NextResponse.json(
        { error: 'Données du programme incomplètes' },
        { status: 400 }
      );
    }

    // Transformer les activités JSONB en objets Activity
    const activities: Activity[] = (program.activities || []).map((activity: any) => ({
      id: activity.id || crypto.randomUUID(),
      title: activity.title || '',
      description: activity.description || '',
      address: activity.address || '',
      price: activity.price || 0,
      imageUrl: activity.imageUrl || null,
      imageAlt: activity.imageAlt || null,
      duration: activity.duration || null,
      category: activity.category || null
    }));

    // Construire l'objet Program validé
    const validatedProgram: Program = {
      id: program.id,
      title: program.title || `Séjour à ${program.destination}`,
      description: program.description || '',
      destination: program.destination,
      start_date: program.start_date,
      end_date: program.end_date,
      budget: program.budget,
      companion: program.companion,
      activities,
      imageUrl: program.imageUrl || null,
      coverImage: program.coverImage || null,
      moods: program.moods || [],
      createdAt: new Date(program.created_at),
      updatedAt: new Date(program.updated_at)
    };

    return NextResponse.json(validatedProgram);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 