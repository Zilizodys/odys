'use client'

import { useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiEdit2, FiCamera, FiMap, FiList, FiBell, FiLock, FiDownload, FiGlobe, FiHeart, FiAward } from 'react-icons/fi'
import { getSupabaseClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import GamificationProfile from '@/components/gamification/GamificationProfile'

interface TravelPreferences {
  preferredDestinations: string[]
  averageBudget: number
  travelStyle: string[]
  interests: string[]
}

interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: 'FR',
    phoneNumber: '',
    bio: ''
  })
  const [travelPreferences, setTravelPreferences] = useState<TravelPreferences>({
    preferredDestinations: [],
    averageBudget: 1000,
    travelStyle: [],
    interests: []
  })
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
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
          country: user?.user_metadata?.country || 'FR',
          phoneNumber: user?.user_metadata?.phone_number || '',
          bio: user?.user_metadata?.bio || ''
        })

        // Récupérer les préférences de voyage
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (preferences) {
          setTravelPreferences(preferences.travel_preferences || {
            preferredDestinations: [],
            averageBudget: 1000,
            travelStyle: [],
            interests: []
          })
          setNotificationPreferences(preferences.notification_preferences || {
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false
          })
        }

        // Récupérer les stats
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('Image size should be less than 2MB')
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: publicUrl
        }
      })

      if (updateError) throw updateError

      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        user_metadata: { 
          ...prev.user_metadata, 
          avatar_url: publicUrl
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
          phone_number: formData.phoneNumber,
          bio: formData.bio
        }
      })

      if (error) throw error

      // Update preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          travel_preferences: travelPreferences,
          notification_preferences: notificationPreferences
        })

      if (preferencesError) throw preferencesError

      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header avec photo de profil et stats */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32">
              <div 
                onClick={handleAvatarClick}
                className="relative w-32 h-32 rounded-full bg-gray-100 cursor-pointer overflow-hidden group"
              >
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Photo de profil"
                    fill
                    className="object-cover group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <FiCamera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{formData.fullName || 'Mon profil'}</h1>
              <p className="text-gray-500 mb-4">{formData.bio || 'Ajouter une bio...'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                  <FiMap className="w-5 h-5" />
                  <span>{programStats.count} programme{programStats.count > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                  <FiList className="w-5 h-5" />
                  <span>{programStats.activities} activité{programStats.activities > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <div className="relative">
            <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm mb-8 relative overflow-x-auto scrollbar-none" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {['Profil', 'Préférences', 'Notifications', 'Gamification', 'Sécurité'].map((label, idx) => (
                <Tab key={label}
                  className={({ selected }) =>
                    clsx(
                      'w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium leading-5 transition-all duration-200 relative',
                      selected
                        ? 'bg-indigo-600 text-white shadow focus:outline-none'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer'
                    )
                  }
                >
                  {idx === 0 && <FiGlobe className="w-4 h-4" />}
                  {idx === 1 && <FiHeart className="w-4 h-4" />}
                  {idx === 2 && <FiBell className="w-4 h-4" />}
                  {idx === 3 && <FiAward className="w-4 h-4" />}
                  {idx === 4 && <FiLock className="w-4 h-4" />}
                  <span>{label}</span>
                </Tab>
              ))}
            </Tab.List>
          </div>

          <Tab.Panels>
            {/* Panel Profil */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="material-field">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="material-input"
                    placeholder=" "
                  />
                  <label className="material-label">Nom complet</label>
                </div>

                <div className="material-field">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="material-input"
                    placeholder=" "
                  />
                  <label className="material-label">Bio</label>
                </div>

                <div className="material-field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="material-input bg-gray-50"
                    placeholder=" "
                    disabled
                  />
                  <label className="material-label">Email</label>
                </div>

                <div className="material-field">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="material-input"
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="CA">Canada</option>
                    <option value="LU">Luxembourg</option>
                  </select>
                  <label className="material-label">Pays</label>
                </div>

                <div className="material-field">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="material-input"
                    placeholder=" "
                  />
                  <label className="material-label">Téléphone</label>
                </div>
              </div>
            </Tab.Panel>

            {/* Panel Préférences */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-sm p-4 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  {/* Budget par paliers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget moyen par voyage</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Gratuit', value: 0, icon: '🎁' },
                        { label: 'Économique', value: 500, icon: '💸' },
                        { label: 'Modéré', value: 1500, icon: '💳' },
                        { label: 'Luxe', value: 3000, icon: '👑' }
                      ].map(option => (
                        <label
                          key={option.value}
                          className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg cursor-pointer text-gray-700 text-sm transition-all duration-150 select-none text-center border shadow-sm ${travelPreferences.averageBudget === option.value ? 'bg-indigo-50 text-indigo-700 font-semibold scale-105 shadow border-indigo-600' : 'hover:bg-indigo-50 border-gray-200'}`}
                          onClick={() => setTravelPreferences(prev => ({ ...prev, averageBudget: option.value }))}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={option.value}
                            checked={travelPreferences.averageBudget === option.value}
                            readOnly
                            className="hidden"
                          />
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Moods multi-sélection */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Moods</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Culture', icon: '🌄' },
                        { label: 'Gastronomie', icon: '🍽️' },
                        { label: 'Nature', icon: '🌳' },
                        { label: 'Sport', icon: '⚽' },
                        { label: 'Shopping', icon: '🛍️' },
                        { label: 'Détente', icon: '🧘' }
                      ].map((style) => {
                        const travelStyleArray = Array.isArray(travelPreferences.travelStyle) ? travelPreferences.travelStyle : [];
                        const checked = travelStyleArray.includes(style.label.toLowerCase());
                        return (
                          <label
                            key={style.label}
                            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg cursor-pointer text-gray-700 text-sm transition-all duration-150 select-none text-center border shadow-sm ${checked ? 'bg-indigo-50 text-indigo-700 font-semibold scale-105 shadow border-indigo-600' : 'hover:bg-indigo-50 border-gray-200'}`}
                            onClick={() => {
                              setTravelPreferences(prev => {
                                const prevArray = Array.isArray(prev.travelStyle) ? prev.travelStyle : [];
                                const newStyle = style.label.toLowerCase();
                                const isChecked = prevArray.includes(newStyle);
                                return {
                                  ...prev,
                                  travelStyle: isChecked
                                    ? prevArray.filter(s => s !== newStyle)
                                    : [...prevArray, newStyle]
                                };
                              });
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              className="hidden"
                            />
                            <span className="text-lg">{style.icon}</span>
                            <span className="font-medium">{style.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Panel Notifications */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Notifications par email</span>
                      <p className="text-sm text-gray-500">Recevoir des mises à jour sur vos voyages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPreferences.emailNotifications}
                      onChange={(e) => setNotificationPreferences(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Notifications push</span>
                      <p className="text-sm text-gray-500">Recevoir des alertes sur votre appareil</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPreferences.pushNotifications}
                      onChange={(e) => setNotificationPreferences(prev => ({
                        ...prev,
                        pushNotifications: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Emails marketing</span>
                      <p className="text-sm text-gray-500">Recevoir des offres et promotions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationPreferences.marketingEmails}
                      onChange={(e) => setNotificationPreferences(prev => ({
                        ...prev,
                        marketingEmails: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>
            </Tab.Panel>

            {/* Panel Gamification */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {user && <GamificationProfile userId={user.id} />}
              </div>
            </Tab.Panel>

            {/* Panel Sécurité */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                  <div className="space-y-4">
                    <div className="material-field">
                      <input
                        type="password"
                        className="material-input"
                        placeholder=" "
                      />
                      <label className="material-label">Mot de passe actuel</label>
                    </div>
                    <div className="material-field">
                      <input
                        type="password"
                        className="material-input"
                        placeholder=" "
                      />
                      <label className="material-label">Nouveau mot de passe</label>
                    </div>
                    <div className="material-field">
                      <input
                        type="password"
                        className="material-input"
                        placeholder=" "
                      />
                      <label className="material-label">Confirmer le nouveau mot de passe</label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Export des données</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Téléchargez une copie de toutes vos données personnelles et vos voyages.
                  </p>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <FiDownload className="w-4 h-4" />
                    Télécharger mes données
                  </button>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold"
          >
            Enregistrer les modifications
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-base font-semibold"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
} 