// Données de test
const testActivities = [
  {
    id: '1',
    title: 'Musée du Louvre',
    description: 'Le plus grand musée d\'art du monde',
    price: 15,
    address: 'Rue de Rivoli, 75001 Paris',
    category: 'musée',
    city: 'Paris'
  },
  {
    id: '2',
    title: 'Tour Eiffel',
    description: 'Monument emblématique de Paris',
    price: 25,
    address: 'Champ de Mars, 75007 Paris',
    category: 'monument',
    city: 'Paris'
  },
  {
    id: '3',
    title: 'Centre Pompidou',
    description: 'Musée d\'art moderne',
    price: 14,
    address: 'Place Georges-Pompidou, 75004 Paris',
    category: 'musée',
    city: 'Paris'
  }
]

// Fonction de normalisation
function normalizeString(str: string) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

// Fonction de filtrage
function filterActivities(activities: any[], destination: string, moods: string[], budget: number) {
  const normalizedDestination = normalizeString(destination)
  const normalizedMoods = moods.map(mood => normalizeString(mood))
  
  // Mapping des catégories
  const categoryVariations = {
    'cultural': ['culture', 'art', 'musée', 'musee', 'exposition', 'histoire', 'monument', 'architecture'],
    'gastronomie': ['gastronomie', 'restaurant', 'food', 'cuisine'],
    'vie nocturne': ['vie nocturne', 'nightlife', 'bar', 'club', 'nuit'],
    'sport': ['sport', 'activité sportive', 'activite sportive'],
    'nature': ['nature', 'parc', 'jardin', 'forêt', 'foret']
  }

  return activities.filter(activity => {
    const city = normalizeString(activity.city)
    const category = normalizeString(activity.category)
    const price = typeof activity.price === 'string' ? parseFloat(activity.price) : activity.price

    // Vérification de la ville
    const matchCity = city.includes(normalizedDestination)

    // Vérification de la catégorie
    const matchCategory = normalizedMoods.some(mood => {
      const directMatch = category.includes(mood) || mood.includes(category)
      
      // Vérification des variations
      const variationMatch = Object.entries(categoryVariations).some(([key, variations]) => {
        if (key === mood) {
          return variations.some(variation => 
            category.includes(variation) || variation.includes(category)
          )
        }
        return false
      })

      return directMatch || variationMatch
    })

    // Vérification du budget
    const matchBudget = price <= budget

    if (!(matchCity && matchCategory && matchBudget)) {
      console.log('Rejetée:', {
        cat: activity.category,
        price: price,
        city: activity.city,
        matchCity,
        matchCategory,
        matchBudget
      })
    }

    return matchCity && matchCategory && matchBudget
  })
}

// Test
const filteredActivities = filterActivities(testActivities, 'Paris', ['cultural'], 30)
console.log('Activités filtrées:', filteredActivities) 