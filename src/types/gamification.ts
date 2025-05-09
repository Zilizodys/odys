export interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  level: number;
  experience: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points_required: number;
  category: 'program' | 'activity';
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  badge_id: string;
  achieved_at: string;
  badge?: Badge;
}

export interface GamificationStats {
  points: number;
  level: number;
  experience: number;
  nextLevelExperience: number;
  badges: Badge[];
  achievements: UserAchievement[];
}

// Points constants
export const POINTS_PER_ACTIVITY = 50;
export const POINTS_PER_PROGRAM = 100;
export const EXPERIENCE_PER_LEVEL = 1000; 