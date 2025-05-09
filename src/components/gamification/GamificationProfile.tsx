import { useEffect, useState } from 'react';
import { GamificationStats, Badge } from '@/types/gamification';
import { GamificationService } from '@/lib/gamification/service';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiTrendingUp, FiLock } from 'react-icons/fi';
import Image from 'next/image';

interface GamificationProfileProps {
  userId: string;
}

export default function GamificationProfile({ userId }: GamificationProfileProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const service = new GamificationService();
      const data = await service.getGamificationStats(userId);
      setStats(data);
      setLoading(false);
    };

    loadStats();
  }, [userId]);

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
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

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

      {/* Liste des badges par catégorie */}
      <div className="space-y-6">
        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
              {category === 'program' ? 'Programmes' : 'Activités'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const isAchieved = stats.achievements.some(
                  achievement => achievement.badge_id === badge.id
                );
                return (
                  <div
                    key={badge.id}
                    className={`relative rounded-lg p-4 ${
                      isAchieved ? 'bg-indigo-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 relative mb-2">
                        <Image
                          src={badge.icon_url}
                          alt={badge.name}
                          fill
                          className={`object-contain ${
                            !isAchieved ? 'opacity-50 grayscale' : ''
                          }`}
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{badge.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <div className="flex items-center gap-1 text-sm">
                        {isAchieved ? (
                          <FiAward className="text-indigo-600" />
                        ) : (
                          <FiLock className="text-gray-400" />
                        )}
                        <span className={isAchieved ? 'text-indigo-600' : 'text-gray-400'}>
                          {badge.points_required} points
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 