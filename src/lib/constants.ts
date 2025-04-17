export const APP_URL = 
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const getURL = () => {
  return typeof window !== 'undefined' ? window.location.origin : ''
} 