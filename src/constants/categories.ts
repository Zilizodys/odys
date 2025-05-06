// Mapping des catégories de l'API vers les catégories frontend
export const API_TO_FRONTEND_CATEGORY: Record<string, string> = {
  'museums': 'culture',
  'architecture': 'culture',
  'historic': 'culture',
  'cultural': 'culture',
  'restaurants': 'gastronomie',
  'interesting_places': 'culture',
  'sport': 'sport',
  'amusements': 'sport',
  'entertainment': 'vie nocturne',
  'gardens': 'nature',
  'natural': 'nature'
}

// Mapping des ambiances aux catégories
export const MOOD_TO_CATEGORY: Record<string, string> = {
  'romantic': 'gastronomie',
  'cultural': 'culture',
  'adventure': 'sport',
  'party': 'vie nocturne',
  'relaxation': 'nature'
}

// Liste des catégories disponibles
export const AVAILABLE_CATEGORIES = [
  'sport',
  'nature',
  'culture',
  'gastronomie',
  'vie nocturne',
  'other'
] as const

export type Category = typeof AVAILABLE_CATEGORIES[number]

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