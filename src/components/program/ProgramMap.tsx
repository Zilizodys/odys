'use client'

import { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Activity } from '@/types/activity'
import { FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface ProgramMapProps {
  activities: Activity[]
  isFullscreen: boolean
  onClose: () => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

export default function ProgramMap({ activities, isFullscreen, onClose }: ProgramMapProps) {
  const [mapCenter, setMapCenter] = useState({
    lat: activities[0]?.lat || 48.8566,
    lng: activities[0]?.lng || 2.3522
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-64 rounded-lg overflow-hidden shadow-lg'}`}
      >
        {isFullscreen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
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
      </motion.div>
    </AnimatePresence>
  )
} 