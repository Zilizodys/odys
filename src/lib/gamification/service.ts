import { createClient } from '@/lib/supabase/client';
import { UserPoints, Badge, UserAchievement, GamificationStats, POINTS_PER_ACTIVITY, POINTS_PER_PROGRAM, EXPERIENCE_PER_LEVEL } from '@/types/gamification';

export class GamificationService {
  private supabase = createClient();

  async getUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await this.supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user points:', error);
      return null;
    }

    return data;
  }

  async initializeUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await this.supabase
      .from('user_points')
      .insert({
        user_id: userId,
        points: 0,
        level: 1,
        experience: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error initializing user points:', error);
      return null;
    }

    return data;
  }

  async addPoints(userId: string, points: number): Promise<UserPoints | null> {
    const userPoints = await this.getUserPoints(userId);
    if (!userPoints) {
      return this.initializeUserPoints(userId);
    }

    const newExperience = userPoints.experience + points;
    const newLevel = Math.floor(newExperience / EXPERIENCE_PER_LEVEL) + 1;

    const { data, error } = await this.supabase
      .from('user_points')
      .update({
        points: userPoints.points + points,
        experience: newExperience,
        level: newLevel
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error adding points:', error);
      return null;
    }

    return data;
  }

  async getBadges(): Promise<Badge[]> {
    const { data, error } = await this.supabase
      .from('badges')
      .select('*')
      .order('points_required', { ascending: true });

    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }

    return data;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data;
  }

  async checkAndAwardBadges(userId: string): Promise<UserAchievement[]> {
    const userPoints = await this.getUserPoints(userId);
    if (!userPoints) return [];

    const badges = await this.getBadges();
    const userAchievements = await this.getUserAchievements(userId);
    const newAchievements: UserAchievement[] = [];

    for (const badge of badges) {
      if (userPoints.points >= badge.points_required && 
          !userAchievements.some(achievement => achievement.badge_id === badge.id)) {
        const { data, error } = await this.supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            badge_id: badge.id
          })
          .select(`
            *,
            badge:badges(*)
          `)
          .single();

        if (!error && data) {
          newAchievements.push(data);
        }
      }
    }

    return newAchievements;
  }

  async getGamificationStats(userId: string): Promise<GamificationStats | null> {
    const userPoints = await this.getUserPoints(userId);
    if (!userPoints) return null;

    const badges = await this.getBadges();
    const achievements = await this.getUserAchievements(userId);

    return {
      points: userPoints.points,
      level: userPoints.level,
      experience: userPoints.experience,
      nextLevelExperience: userPoints.level * EXPERIENCE_PER_LEVEL,
      badges,
      achievements
    };
  }

  // Méthodes spécifiques pour les actions
  async addActivityPoints(userId: string): Promise<UserPoints | null> {
    return this.addPoints(userId, POINTS_PER_ACTIVITY);
  }

  async addProgramPoints(userId: string): Promise<UserPoints | null> {
    return this.addPoints(userId, POINTS_PER_PROGRAM);
  }
} 