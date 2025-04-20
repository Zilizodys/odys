'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HeaderProps {
  showBackButton?: boolean
}

export default function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl font-bold text-indigo-600">Odys</h1>
        </div>
        <div className="relative w-[50px] h-[50px]">
          <Image
            src="/images/activities/Mascot.png"
            alt="Mascotte Odys"
            width={50}
            height={50}
            priority
            className="object-contain w-auto h-auto"
          />
        </div>
      </div>
    </header>
  )
} 