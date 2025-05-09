import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { GamificationStats, Badge } from '@/types/gamification';
import { GamificationService } from '@/lib/gamification/service';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { FiAward, FiStar, FiTrendingUp, FiLock, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import { Tab } from '@headlessui/react'

interface GamificationProfileProps {
  userId: string;
}

export default function GamificationProfile({ userId }: GamificationProfileProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const service = new GamificationService();
      const data = await service.getGamificationStats(userId);
      setStats(data);
      setLoading(false);
    };

    loadStats();
  }, [userId]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const progress = (stats.experience / stats.nextLevelExperience) * 100;

  // Grouper les badges par catégorie
  const badgesByCategory = stats.badges.reduce((acc, badge) => {
    const cat = badge.category === 'program' || badge.category === 'activity' ? badge.category : 'general';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

  const categories = [
    { key: 'program', label: 'Programmes' },
    { key: 'activity', label: 'Activités' },
    { key: 'general', label: 'Général' }
  ];

  // Mapping badge name -> emoji
  const badgeEmojis: Record<string, string> = {
    'Premier Voyage': '🛫',
    'Explorateur': '🧭',
    'Aventurier': '🏔️',
    'Voyageur Solo': '🧑‍🦯',
    'Gourmet': '🍽️',
    'Culturel': '🖼️',
    'Sportif': '🏅',
    'Noctambule': '🌙',
    'Nature': '🌳',
    'Profil complété': '��',
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec niveau et progression */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Progression</h2>
          <div className="flex items-center gap-2 text-indigo-600">
            <FiTrendingUp className="w-5 h-5" />
            <span className="font-medium">Niveau {stats.level}</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{stats.experience} XP</span>
            <span>{stats.nextLevelExperience} XP</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Points et badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <FiStar className="w-5 h-5" />
              <span className="font-medium">Points</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <FiAward className="w-5 h-5" />
              <span className="font-medium">Badges</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.achievements.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs pour les catégories de badges */}
      <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
        <Tab.List className="flex space-x-2 mb-6">
          {categories.map((cat, idx) => (
            <Tab
              key={cat.key}
              className={({ selected }) =>
                `px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors ${
                  selected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'
                }`
              }
            >
              {cat.label}
            </Tab>
          ))}
        </Tab.List>
        <div className="relative overflow-hidden" ref={containerRef} style={{ minHeight: 320 }}>
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: -(containerWidth * (categories.length - 1)), right: 0 }}
            dragElastic={0.2}
            style={{ x: -tabIndex * containerWidth }}
            onDragEnd={(event, info) => {
              if (info.offset.x < -80 && tabIndex < categories.length - 1) {
                setTabIndex(tabIndex + 1);
              } else if (info.offset.x > 80 && tabIndex > 0) {
                setTabIndex(tabIndex - 1);
              }
            }}
            animate={{ x: -tabIndex * containerWidth }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {categories.map((cat, idx) => (
              <div key={cat.key} className="min-w-full px-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(badgesByCategory[cat.key] || []).map((badge) => {
                    const isAchieved = stats.achievements.some(
                      achievement => achievement.badge_id === badge.id
                    );
                    return (
                      <div
                        key={badge.id}
                        className={`relative flex flex-col items-center text-center transition-all duration-200 select-none`}
                      >
                        <div className={`relative w-20 h-20 flex items-center justify-center rounded-full mb-3 shadow-lg border-4 transition-all duration-300 ${
                          isAchieved
                            ? 'bg-gradient-to-br from-indigo-200 via-indigo-100 to-blue-100 border-indigo-400 scale-110 animate-bounce-smooth'
                            : 'bg-gray-100 border-gray-200 opacity-60'
                        }`}>
                          <span className={`text-4xl md:text-5xl transition-all duration-200 ${isAchieved ? 'text-indigo-700' : 'text-gray-400'}`}>{badgeEmojis[badge.name] || '🏅'}</span>
                          {isAchieved && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md">
                              <FiStar className="text-white w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1 text-base leading-tight">{badge.name}</h4>
                        <p className="text-xs text-gray-500 mb-2 leading-snug max-w-[120px] mx-auto">{badge.description}</p>
                        <div className="flex items-center gap-1 text-xs">
                          {isAchieved ? (
                            <FiAward className="text-indigo-600" />
                          ) : (
                            <FiLock className="text-gray-300" />
                          )}
                          <span className={isAchieved ? 'text-indigo-600 font-semibold' : 'text-gray-400'}>
                            {badge.points_required} points
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Tab.Group>
    </div>
  );
} 