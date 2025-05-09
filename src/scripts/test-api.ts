import fetch from 'node-fetch'

async function testAPI() {
  const testData = {
    destination: 'Paris',
    moods: ['cultural'],
    budget: 2,
    companion: 'solo'
  }

  try {
    const response = await fetch('http://localhost:3000/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const activities = await response.json()
    console.log('Réponse de l\'API:', activities)
  } catch (error) {
    console.error('Erreur lors du test:', error)
  }
}

testAPI() 