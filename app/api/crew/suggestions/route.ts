import { NextResponse } from 'next/server'
import { CrewAIRequest, CrewAIResponse, TransformedResponse } from '@/types/crew'
import { API_TO_FRONTEND_CATEGORY } from '@/constants/categories'
import { CREW_API_URL } from '@/config/crew'
import { handleApiError, ValidationError } from '@/lib/errors'
import { cache } from '@/lib/cache'

const SUGGESTIONS_CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const SUGGESTIONS_CACHE_KEY = (destination: string, moods: string[]) => 
  `suggestions:${destination}:${moods.sort().join(',')}`

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body.formData)  // Envoyer directement formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`Le service de suggestions est temporairement indisponible (${response.status})`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, activities: data });
    
  } catch (error) {
    const { error: errorResponse, statusCode } = handleApiError(error)
    return NextResponse.json(
      { 
        success: false, 
        error: errorResponse,
        details: error instanceof Error ? error.message : 'fetch failed'
      },
      { status: statusCode }
    );
  }
}

async function handler(request: Request) {
  try {
    // Vérifier que le token API est configuré
    if (!process.env.CREW_API_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuration du service de suggestions manquante',
          details: 'Token API non configuré'
        },
        { status: 500 }
      )
    }

    const body: CrewAIRequest = await request.json()
    
    // Validation des données
    if (!body.formData) {
      throw new ValidationError('Données du formulaire manquantes')
    }

    const { destination, startDate, endDate, budget, companion, moods } = body.formData
    const requiredFields = { destination, startDate, endDate, budget, companion, moods }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      throw new ValidationError(
        `Données invalides: ${missingFields.join(', ')}`,
        { missingFields }
      )
    }

    // Vérifier le cache avant d'appeler l'API
    const cacheKey = SUGGESTIONS_CACHE_KEY(destination, moods)
    const cachedData = cache.get<TransformedResponse>(cacheKey, { storage: 'memory' })
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Headers communs pour les requêtes à l'API Crew
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CREW_API_TOKEN}`,
      'Origin': request.headers.get('origin') || 'http://localhost:3000'
    }

    // Vérifier la disponibilité de l'API
    try {
      const healthCheck = await fetch(`${CREW_API_URL}/health`, { headers })
      if (!healthCheck.ok) {
        if (healthCheck.status === 401) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Erreur d\'authentification avec le service de suggestions',
              details: 'Token API invalide ou expiré'
            },
            { status: 401 }
          )
        }

        throw new Error('API Crew AI indisponible')
      }
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Le service de suggestions est temporairement indisponible',
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        },
        { status: 503 }
      )
    }
    
    // Appel à l'API Crew
    const crewRequestData = {
      destination: body.formData.destination,
      start_date: body.formData.startDate,
      end_date: body.formData.endDate,
      budget: body.formData.budget.toString(),
      traveler_type: body.formData.companion,
      interests: body.formData.moods
    }

    let crewResponse;
    try {
      crewResponse = await fetch(`${CREW_API_URL}/suggestions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(crewRequestData),
      })
    } catch (fetchError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur réseau lors de la communication avec Crew AI',
          details: fetchError instanceof Error ? fetchError.message : fetchError
        },
        { status: 503 }
      )
    }

    if (!crewResponse.ok) {
      const errorText = await crewResponse.text()

      // Gestion spécifique des erreurs d'authentification
      if (crewResponse.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Erreur d\'authentification avec le service de suggestions',
            details: 'Token API invalide ou expiré'
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { 
          success: false, 
          error: `Erreur du service de suggestions: ${crewResponse.statusText}`,
          details: errorText
        },
        { status: crewResponse.status }
      )
    }

    const data: CrewAIResponse = await crewResponse.json()
    
    // Transformation de la réponse
    const transformedResponse: TransformedResponse = {
      success: true,
      activities: data.activities?.map(activity => ({
        ...activity,
        category: API_TO_FRONTEND_CATEGORY[activity.category?.toLowerCase() || ''] || 'culture'
      })) || [],
      error: data.activities?.length === 0 ? "Aucune activité trouvée pour cette destination" : undefined
    }

    // Mettre en cache les résultats
    if (transformedResponse.activities.length > 0) {
      cache.set(cacheKey, transformedResponse, {
        ttl: SUGGESTIONS_CACHE_TTL,
        storage: 'memory'
      })
    }

    return NextResponse.json(transformedResponse)
  } catch (error) {
    const { error: errorResponse, statusCode } = handleApiError(error)
    return NextResponse.json(
      { 
        success: false, 
        error: errorResponse,
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, 
      { status: statusCode }
    )
  }
} 