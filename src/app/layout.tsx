import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link";
import Header from '@/components/ui/Header';
import type { Metadata } from 'next'
import PageTransition from '@/components/transitions/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Odys - Votre assistant de voyage',
  description: 'Créez votre programme de voyage personnalisé en quelques clics',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4F46E5' },
    { media: '(prefers-color-scheme: dark)', color: '#4F46E5' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          {/*
            La tab bar est toujours au-dessus du contenu (z-50),
            mais la modale de connexion utilise z-[1000] pour passer au-dessus si besoin.
          */}
          <div className="max-w-md mx-auto px-4">
            <div className="flex justify-between py-3">
              <Link href="/" prefetch={false} className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
                <span className="sr-only">Accueil</span>
                <svg aria-hidden="true" className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Accueil</span>
              </Link>
              
              <Link href="/generate" prefetch={false} className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
                <span className="sr-only">Créer</span>
                <svg aria-hidden="true" className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Créer</span>
              </Link>
              
              <Link href="/dashboard" prefetch={false} className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
                <span className="sr-only">Voyages</span>
                <svg aria-hidden="true" className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Voyages</span>
              </Link>
              
              <Link href="/settings" prefetch={false} className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
                <span className="sr-only">Profil</span>
                <svg aria-hidden="true" className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Profil</span>
              </Link>
            </div>
          </div>
        </nav>
      </body>
    </html>
  )
}
