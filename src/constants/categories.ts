export type Category = 
  | 'culture'
  | 'gastronomie'
  | 'sport'
  | 'vie nocturne'
  | 'nature'
  | 'other';

export const DEFAULT_CATEGORY: Category = 'other';

export const CATEGORY_LABELS: Record<Category, string> = {
  'culture': 'Culture',
  'gastronomie': 'Gastronomie',
  'sport': 'Sport',
  'vie nocturne': 'Vie nocturne',
  'nature': 'Nature',
  'other': 'Autres'
};

export function normalizeCategory(category: string | undefined | null): Category {
  if (!category) return DEFAULT_CATEGORY;
  
  const normalized = category.toLowerCase().trim();
  
  if (Object.keys(CATEGORY_LABELS).includes(normalized)) {
    return normalized as Category;
  }
  
  return DEFAULT_CATEGORY;
} 