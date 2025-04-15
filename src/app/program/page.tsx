'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import { Activity } from '@/types/activity'
import { FormData } from '@/types/form'

export default function ProgramPage() {
  const router = useRouter()
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    // Récupérer les activités sauvegardées
    const savedActivitiesStr = localStorage.getItem('savedActivities')
    if (savedActivitiesStr) {
      setSavedActivities(JSON.parse(savedActivitiesStr))
    }

    // Récupérer les données du formulaire
    const formDataStr = localStorage.getItem('formData')
    if (formDataStr) {
      setFormData(JSON.parse(formDataStr))
    }
  }, [])

  const handleSaveProgram = () => {
    if (!formData || savedActivities.length === 0) return

    // Créer un nouveau programme
    const newProgram = {
      id: Date.now().toString(),
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      activities: savedActivities,
      createdAt: new Date().toISOString()
    }

    // Récupérer les programmes existants
    const existingPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]')
    
    // Ajouter le nouveau programme
    const updatedPrograms = [...existingPrograms, newProgram]
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('savedPrograms', JSON.stringify(updatedPrograms))
    
    // Nettoyer les données temporaires
    localStorage.removeItem('savedActivities')
    localStorage.removeItem('formData')

    // Rediriger vers le dashboard
    router.push('/dashboard')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }

  const getBudgetLabel = (budget: number) => {
    switch (budget) {
      case 500: return 'Économique'
      case 1000: return 'Modéré'
      case 2000: return 'Luxe'
      default: return `${budget}€`
    }
  }

  const getCompanionLabel = (companion: string) => {
    switch (companion) {
      case 'solo': return 'Solo'
      case 'couple': return 'En couple'
      case 'family': return 'En famille'
      case 'friends': return 'Entre amis'
      default: return companion
    }
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            Aucune donnée de programme disponible
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Votre Programme</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 space-y-2">
          <p className="text-gray-800">
            <span className="font-medium">Destination :</span> {formData.destination}
          </p>
          <p className="text-gray-800">
            <span className="font-medium">Dates :</span> Du {formatDate(formData.startDate)} au {formatDate(formData.endDate)}
          </p>
          <p className="text-gray-800">
            <span className="font-medium">Voyageurs :</span> {getCompanionLabel(formData.companion)}
          </p>
          <p className="text-gray-800">
            <span className="font-medium">Budget :</span> {getBudgetLabel(formData.budget)}€
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Activités sélectionnées</h2>
        
        {savedActivities.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            Aucune activité sélectionnée
          </p>
        ) : (
          <div className="space-y-4">
            {savedActivities.map((activity) => (
              <div 
                key={activity.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex">
                  <div className="w-1/3 h-40">
                    <img
                      src={activity.imageUrl}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/600x400/e4e4e7/1f2937?text=${encodeURIComponent(activity.title)}`;
                      }}
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="font-bold text-lg mb-1">{activity.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-gray-500 text-sm">📍 {activity.address}</p>
                      <p className="text-indigo-600 font-semibold">{activity.price}€</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSaveProgram}
          disabled={!formData || savedActivities.length === 0}
          className="w-full mt-8 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Enregistrer le programme
        </button>
      </main>
    </div>
  )
} 