export function getCrewApiUrl(): string {
  // Force l'utilisation de l'IPv4 pour éviter le bug de localhost/::1
  return 'http://127.0.0.1:8001'
}

export const CREW_API_URL = getCrewApiUrl() 