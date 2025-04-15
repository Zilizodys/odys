import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // État initial avec une valeur par défaut
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  // État pour suivre si le composant est monté
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    try {
      const item = localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Erreur lors du chargement de ${key}:`, error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error)
    }
  }

  return [isHydrated ? storedValue : initialValue, setValue] as const
} 