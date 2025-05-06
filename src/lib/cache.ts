type CacheOptions = {
  ttl?: number; // Time to live in milliseconds
  storage?: 'memory' | 'local'; // Type de stockage
}

type CacheItem<T> = {
  value: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private memoryCache: Map<string, CacheItem<any>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes par défaut
  private isLocalStorageAvailable: boolean;

  constructor() {
    this.isLocalStorageAvailable = typeof window !== 'undefined' && 'localStorage' in window;
    // Nettoyer le cache mémoire périodiquement
    if (this.isLocalStorageAvailable) {
      setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  private cleanup() {
    const now = Date.now();
    // Nettoyer le cache mémoire
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }
    
    // Nettoyer le localStorage
    if (this.isLocalStorageAvailable) {
      try {
        const storageKeys = Object.keys(localStorage);
        for (const key of storageKeys) {
          if (key.startsWith('cache:')) {
            const item = this.getFromStorage(key);
            if (item && now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
            }
          }
        }
      } catch (error) {
        console.warn('Erreur lors du nettoyage du cache localStorage:', error);
      }
    }
  }

  private getFromStorage<T>(key: string): CacheItem<T> | null {
    if (!this.isLocalStorageAvailable) return null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item);
    } catch (error) {
      console.warn('Erreur lors de la lecture du cache localStorage:', error);
      return null;
    }
  }

  private setToStorage<T>(key: string, value: CacheItem<T>): void {
    if (!this.isLocalStorageAvailable) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Erreur lors de l\'écriture dans le cache localStorage:', error);
    }
  }

  set<T>(
    key: string,
    value: T,
    options?: {
      ttl?: number;
      storage?: 'memory' | 'local';
    }
  ): void {
    const now = Date.now();
    const ttl = options?.ttl || this.defaultTTL;
    const item: CacheItem<T> = {
      value,
      timestamp: now,
      ttl,
    };

    // Always set in memory cache
    this.memoryCache.set(key, item);

    // Set in localStorage if not memory-only
    if (options?.storage !== 'memory') {
      this.setToStorage(`cache:${key}`, item);
    }
  }

  get<T>(key: string, options?: { storage?: 'memory' | 'local' }): T | null {
    const now = Date.now();
    
    // Check memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && now - memoryItem.timestamp <= memoryItem.ttl) {
      return memoryItem.value as T;
    }

    // If memory-only, don't check localStorage
    if (options?.storage === 'memory') {
      return null;
    }

    // Check localStorage
    const item = this.getFromStorage<T>(`cache:${key}`);
    if (!item || now - item.timestamp > item.ttl) {
      if (this.isLocalStorageAvailable) {
        try {
          localStorage.removeItem(`cache:${key}`);
        } catch (error) {
          console.warn('Erreur lors de la suppression du cache localStorage:', error);
        }
      }
      return null;
    }
    return item.value;
  }

  delete(key: string, options: CacheOptions = {}): void {
    const { storage = 'memory' } = options;
    if (storage === 'memory') {
      this.memoryCache.delete(key);
    } else if (this.isLocalStorageAvailable) {
      try {
        localStorage.removeItem(`cache:${key}`);
      } catch (error) {
        console.warn('Erreur lors de la suppression du cache localStorage:', error);
      }
    }
  }

  clear(storage: 'memory' | 'local' | 'all' = 'all'): void {
    if (storage === 'memory' || storage === 'all') {
      this.memoryCache.clear();
    }
    
    if ((storage === 'local' || storage === 'all') && this.isLocalStorageAvailable) {
      try {
        const storageKeys = Object.keys(localStorage);
        for (const key of storageKeys) {
          if (key.startsWith('cache:')) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn('Erreur lors du nettoyage du cache localStorage:', error);
      }
    }
  }
}

export const cache = new Cache(); 