'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/ui/Header'

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isProgramPage = pathname?.startsWith('/program/')

  return (
    <>
      {!isProgramPage && <Header />}
      {children}
    </>
  )
} 