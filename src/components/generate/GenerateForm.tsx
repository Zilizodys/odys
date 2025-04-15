'use client'

import React, { useState, useRef, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fr } from 'date-fns/locale'
import { differenceInDays } from 'date-fns'
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import StepWrapper from '../ui/StepWrapper'
import { 
  FormData, 
  INITIAL_FORM_DATA, 
  MOOD_OPTIONS, 
  COMPANION_OPTIONS, 
  BUDGET_OPTIONS,
  SUGGESTED_DESTINATIONS,
  MoodType
} from '@/types/form'

// Enregistrer la localisation française
registerLocale('fr', fr)

const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <div className="relative" onClick={onClick} ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        placeholder="Sélectionnez vos dates"
        className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer text-gray-900 placeholder-gray-400"
      />
      <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
)

CustomInput.displayName = 'CustomInput'

export default function GenerateForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const datePickerRef = useRef<any>(null)
  const router = useRouter()

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setDirection('right')
      setCurrentStep(prev => prev + 1)
    } else {
      // Sauvegarder les données du formulaire
      localStorage.setItem('formData', JSON.stringify(formData))
      
      // Rediriger vers la page des suggestions avec les moods sélectionnés
      const moodsParam = formData.moods.join(',')
      router.push(`/suggestions?moods=${moodsParam}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection('left')
      setCurrentStep(prev => prev - 1)
    }
  }

  const calculateProgress = () => ((currentStep - 1) / 4) * 100

  const calculateDuration = (formData: FormData): number => {
    if (!formData.startDate || !formData.endDate) return 0
    return differenceInDays(new Date(formData.endDate), new Date(formData.startDate))
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !formData.destination.trim()
      case 2:
        return !formData.startDate || !formData.endDate
      case 3:
        return !formData.companion
      case 4:
        return !formData.budget
      case 5:
        return formData.moods.length === 0
      default:
        return false
    }
  }

  const handleDestinationSelect = (destination: string) => {
    updateFormData('destination', destination)
    // Passer automatiquement à l'étape suivante
    setDirection('right')
    setCurrentStep(prev => prev + 1)
  }

  const handleDateSelect = (type: 'start' | 'end', date: Date | null) => {
    if (!date) return

    const dateStr = date.toISOString().split('T')[0]
    if (type === 'start') {
      updateFormData('startDate', dateStr)
      // Si la date de fin n'est pas définie ou est antérieure à la nouvelle date de début
      if (!formData.endDate || new Date(formData.endDate) <= date) {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        updateFormData('endDate', nextDay.toISOString().split('T')[0])
      }
    } else {
      updateFormData('endDate', dateStr)
    }
  }

  const handleStartNow = () => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    
    updateFormData('startDate', today.toISOString().split('T')[0])
    updateFormData('endDate', tomorrow.toISOString().split('T')[0])
  }

  const handleCalendarClose = () => {
    setIsCalendarOpen(false)
  }

  const getFormattedDateRange = () => {
    if (formData.startDate && formData.endDate) {
      return `${new Date(formData.startDate).toLocaleDateString('fr-FR')} - ${new Date(formData.endDate).toLocaleDateString('fr-FR')}`
    }
    return ''
  }

  return (
    <div className="max-w-2xl mx-auto relative min-h-[500px]">
      {/* Progress bar */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-md px-4">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === currentStep
                    ? 'bg-indigo-600 text-white'
                    : step < currentStep
                    ? 'bg-indigo-100'
                    : 'bg-gray-100'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 25}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form steps */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {currentStep === 1 && (
            <StepWrapper key="step1" title="Où veux-tu partir ?" direction={direction}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 text-left mb-1">
                    Entrez la ville ou le pays de votre choix
                  </p>
                  <input
                    type="text"
                    placeholder="Ex: Paris, Tokyo, New York..."
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Destinations populaires
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {SUGGESTED_DESTINATIONS.map((destination) => (
                      <button
                        key={destination.city}
                        onClick={() => handleDestinationSelect(destination.city)}
                        className={`p-3 rounded-lg border flex items-center space-x-3 transition-colors ${
                          formData.destination === destination.city
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{destination.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{destination.city}</div>
                          <div className="text-sm text-gray-500">{destination.country}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {currentStep === 2 && (
            <StepWrapper key="step2" title="Quand souhaites-tu partir ?" direction={direction}>
              <div className="space-y-8">
                <div className="bg-indigo-50 rounded-xl overflow-hidden">
                  <button
                    onClick={handleStartNow}
                    className="w-full flex items-center justify-center gap-3 p-4 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <span className="text-xl">📅</span>
                    <span className="font-medium">Partir maintenant</span>
                  </button>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">
                    Dates du voyage
                  </label>
                  <div className="bg-white rounded-2xl shadow-lg p-4 mt-2 mb-2">
                    <DatePicker
                      ref={datePickerRef}
                      selected={formData.startDate ? new Date(formData.startDate) : null}
                      onChange={(dates) => {
                        const [start, end] = dates as [Date | null, Date | null]
                        if (start) {
                          const startStr = start.toISOString().split('T')[0]
                          updateFormData('startDate', startStr)
                        }
                        if (end) {
                          const endStr = end.toISOString().split('T')[0]
                          updateFormData('endDate', endStr)
                        }
                      }}
                      startDate={formData.startDate ? new Date(formData.startDate) : null}
                      endDate={formData.endDate ? new Date(formData.endDate) : null}
                      minDate={new Date()}
                      locale="fr"
                      selectsRange
                      monthsShown={1}
                      dateFormat="dd/MM/yyyy"
                      customInput={<CustomInput value={getFormattedDateRange()} />}
                      onCalendarOpen={() => setIsCalendarOpen(true)}
                      onCalendarClose={handleCalendarClose}
                      calendarContainer={({ children }) => (
                        <div className="react-datepicker__calendar-container odys-datepicker-container">
                          {children}
                          <button
                            className="datepicker-done-button"
                            onClick={() => datePickerRef.current?.setOpen(false)}
                          >
                            Terminé
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
                {calculateDuration(formData) > 0 && (
                  <p className="text-base text-gray-600 text-center font-medium">
                    Durée du voyage : {calculateDuration(formData)} jour{calculateDuration(formData) > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </StepWrapper>
          )}

          {currentStep === 3 && (
            <StepWrapper key="step3" title="Avec qui voyages-tu ?" direction={direction}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {COMPANION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData('companion', option.value)}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                        formData.companion === option.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      <span className="text-2xl mb-2">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Sélectionnez le type de voyage qui vous correspond le mieux
                </p>
              </div>
            </StepWrapper>
          )}

          {currentStep === 4 && (
            <StepWrapper key="step4" title="Budget" direction={direction}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData('budget', option.value)}
                      className={`p-4 rounded-lg border ${
                        formData.budget === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </StepWrapper>
          )}

          {currentStep === 5 && (
            <StepWrapper key="step5" title="Ambiances souhaitées" direction={direction}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {MOOD_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData('moods', [...formData.moods, option.value as MoodType])}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                        formData.moods.includes(option.value as MoodType)
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      <span className="text-2xl mb-2">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex gap-2">
        <button
          onClick={handlePrevious}
          className={`w-1/2 px-6 py-2 rounded-md ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          disabled={currentStep === 1}
        >
          Précédent
        </button>
        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={`w-1/2 px-6 py-2 rounded-md ${
            isNextDisabled()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {currentStep === 5 ? 'Voir les suggestions' : 'Suivant'}
        </button>
      </div>
    </div>
  )
}