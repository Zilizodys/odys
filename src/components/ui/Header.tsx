'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  showBackButton?: boolean
}

export default function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="w-full py-4 px-6 border-b flex items-center justify-center relative">
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="absolute left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      <div className="flex justify-center w-full">
        <Image
          src="/Odys-logo.svg"
          alt="Logo Odys"
          width={127}
          height={38}
          className="mx-auto"
          priority
        />
      </div>
    </header>
  )
} 