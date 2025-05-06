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
    console.log('📝 Données reçues:', body);
    
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
      console.error('❌ Erreur API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`Le service de suggestions est temporairement indisponible (${response.status})`);
    }

    const data = await response.json();
    console.log('✅ Réponse API:', data);
    return NextResponse.json({ success: true, activities: data });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        details: error instanceof Error ? error.message : 'fetch failed'
      },
      { status: 503 }
    );
  }
}

async function handler(request: Request) {
  try {
    // Vérifier que le token API est configuré
    if (!process.env.CREW_API_TOKEN) {
      console.error('❌ Token API Crew non configuré')
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
    console.log('📝 Données reçues du formulaire:', body.formData)
    
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
      console.log('✅ Données récupérées du cache pour:', destination)
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
        const errorText = await healthCheck.text()
        console.error('❌ API Crew AI indisponible:', errorText)
        
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
      console.error('❌ Erreur lors de la vérification de santé de l\'API:', error)
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

    console.log('🔄 [API/crew/suggestions] Envoi à Crew AI:', {
      url: `${CREW_API_URL}/suggestions`,
      headers,
      data: crewRequestData
    })

    let crewResponse;
    try {
      crewResponse = await fetch(`${CREW_API_URL}/suggestions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(crewRequestData),
      })
    } catch (fetchError) {
      console.error('❌ [API/crew/suggestions] Erreur fetch vers Crew AI:', fetchError)
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
      console.error('❌ Erreur de l\'API Crew:', {
        status: crewResponse.status,
        statusText: crewResponse.statusText,
        error: errorText
      })

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
    console.log('✅ Réponse brute de Crew AI:', data)
    
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

    console.log('✅ Réponse transformée:', {
      success: transformedResponse.success,
      activitiesCount: transformedResponse.activities.length,
      categories: transformedResponse.activities.map(a => a.category)
    })

    return NextResponse.json(transformedResponse)
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
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