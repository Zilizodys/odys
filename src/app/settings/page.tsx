'use client'

import { useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiEdit2, FiCamera, FiMap, FiList } from 'react-icons/fi'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: 'US',
    phoneNumber: ''
  })
  const [programStats, setProgramStats] = useState({ count: 0, activities: 0 })
  
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        if (!user) throw new Error('User not found')
        
        setUser(user)
        setFormData({
          fullName: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          country: user?.user_metadata?.country || 'US',
          phoneNumber: user?.user_metadata?.phone_number || ''
        })
        // Récupérer les stats programmes/activités
        const { data: programs, error: programsError } = await supabase
          .from('programs')
          .select('id')
          .eq('user_id', user.id)
        if (programsError) throw programsError
        const programIds = programs?.map((p: any) => p.id) || []
        let activitiesCount = 0
        if (programIds.length > 0) {
          const { count, error: countError } = await supabase
            .from('program_activities')
            .select('id', { count: 'exact', head: true })
            .in('program_id', programIds)
          if (countError) throw countError
          activitiesCount = count || 0
        }
        setProgramStats({ count: programIds.length, activities: activitiesCount })
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [router, supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setIsUploading(true)
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64
        throw new Error('Image size should be less than 2MB')
      }

      // Convert to base64
      const reader = new FileReader()
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

      const base64String = await base64Promise

      // Update user metadata with base64 image
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: base64String,
          avatar_type: file.type
        }
      })

      if (updateError) throw updateError

      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        user_metadata: { 
          ...prev.user_metadata, 
          avatar_url: base64String,
          avatar_type: file.type
        }
      } : null)

    } catch (error: any) {
      console.error('Erreur lors du téléchargement de l\'image:', error.message || error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          country: formData.country,
          phone_number: formData.phoneNumber
        }
      })

      if (error) throw error
      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
        <p className="text-gray-500 mb-8">
          Personnalise ton expérience et retrouve toutes les infos de ton compte.
        </p>

        <div className="relative w-24 h-24 mx-auto mb-8">
          <div 
            onClick={handleAvatarClick}
            className="relative w-24 h-24 rounded-full bg-gray-100 cursor-pointer overflow-hidden group"
          >
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Photo de profil"
                fill
                className="object-cover group-hover:opacity-75 transition-opacity"
                unoptimized={user.user_metadata.avatar_url.startsWith('data:')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <FiCamera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <button 
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200"
            aria-label="Modifier la photo"
          >
            <FiEdit2 className="w-4 h-4 text-gray-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Stats programmes/activités */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-xl shadow-md px-8 py-5 flex flex-col sm:flex-row items-center gap-6 border border-gray-100">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <FiMap className="w-5 h-5" />
              <span>{programStats.count} programme{programStats.count > 1 ? 's' : ''} créé{programStats.count > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <FiList className="w-5 h-5" />
              <span>{programStats.activities} activité{programStats.activities > 1 ? 's' : ''} ajoutée{programStats.activities > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Andrew Ainsley"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              placeholder="andrew.ainsley@yourdomain.com"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="US">United States America</option>
              <option value="FR">France</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
} 