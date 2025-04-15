'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  showBackButton?: boolean
}

export default function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold">Odys</h1>
      </div>
    </header>
  )
} 