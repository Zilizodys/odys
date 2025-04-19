import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Pour un nouveau programme, nous retournons un template vide
    const emptyProgram = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      destination: '',
      start_date: '',
      end_date: '',
      budget: 0,
      companion: '',
      activities: [],
      imageurl: null,
      coverImage: null,
      moods: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: emptyProgram
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