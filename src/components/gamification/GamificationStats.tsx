import { useEffect, useState } from 'react';
import { GamificationStats } from '@/types/gamification';
import { GamificationService } from '@/lib/gamification/service';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

interface GamificationStatsProps {
  userId: string;
}

export default function GamificationStats({ userId }: GamificationStatsProps) {
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

  return (
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
      <div className="grid grid-cols-2 gap-4 mb-6">
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

      {/* Badges récents */}
      {stats.achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Badges récents</h3>
          <div className="grid grid-cols-3 gap-4">
            {stats.achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 relative mb-2">
                  <Image
                    src={achievement.badge?.icon_url || '/badges/default.svg'}
                    alt={achievement.badge?.name || 'Badge'}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {achievement.badge?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 