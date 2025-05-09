"use client"

import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { createClient } from '@/lib/supabase/client'
import { Activity } from '@/types/activity'

// Configuration de la carte
const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 48.8566, // Paris par défaut
  lng: 2.3522
}

export default function ProgrammePage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState(center)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const client = createClient()
        if (!client) {
          throw new Error('Impossible de créer le client Supabase')
        }

        const { data: { session } } = await client.auth.getSession()
        if (!session) {
          console.error('Non authentifié')
          return
        }

        // Récupérer les programmes de l'utilisateur avec leurs activités
        const { data: programs, error: programsError } = await client
          .from('programs')
          .select(`
            *,
            program_activities (
              activities (
                id,
                title,
                description,
                price,
                address,
                imageurl,
                category,
                city,
                lat,
                lng
              )
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (programsError) throw programsError

        // Transformer les données pour avoir les activités directement
        const allActivities = programs?.flatMap(program => 
          program.program_activities?.map((pa: any) => pa.activities) || []
        ) || []

        setActivities(allActivities)

        // Mettre à jour le centre de la carte si des activités sont présentes
        if (allActivities.length > 0 && allActivities[0].lat && allActivities[0].lng) {
          setMapCenter({
            lat: allActivities[0].lat,
            lng: allActivities[0].lng
          })
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des activités:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Programme des Activités</h1>
      
      {/* Carte Google Maps */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
          >
            {activities.map((activity) => (
              <Marker
                key={activity.id}
                position={{ lat: activity.lat, lng: activity.lng }}
                title={activity.title}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Liste des activités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{activity.title}</h3>
            <p className="text-gray-600">{activity.address}</p>
            <p className="text-sm text-gray-500 mt-2">{activity.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 