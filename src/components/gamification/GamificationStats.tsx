import { useEffect, useState } from 'react';
import type { GamificationStats as GamificationStatsType } from '@/types/gamification';
import { GamificationService } from '@/lib/gamification/service';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

interface GamificationStatsProps {
  userId: string;
  userAvatarUrl?: string;
}

export default function GamificationStats({ userId, userAvatarUrl }: GamificationStatsProps) {
  const [stats, setStats] = useState<GamificationStatsType | null>(null);
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

  console.log('Avatar utilisateur (userAvatarUrl) :', userAvatarUrl);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6">
        {userAvatarUrl ? (
          <Image
            src={userAvatarUrl}
            alt="Avatar utilisateur"
            width={56}
            height={56}
            className="rounded-full border border-gray-200 shadow-sm object-cover"
          />
        ) : (
          <Image
            src="/images/activities/Mascot.png"
            alt="Mascotte"
            width={56}
            height={56}
            className="rounded-full border border-gray-200 shadow-sm object-cover bg-white"
          />
        )}
        <div className="flex flex-col justify-center flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Progression</h2>
            <div className="flex items-center gap-2 text-indigo-600">
              <FiTrendingUp className="w-5 h-5" />
              <span className="font-medium">Niveau {stats.level}</span>
            </div>
          </div>
          {/* Barre de progression */}
          <div>
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
        </div>
      </div>
    </div>
  );
} 