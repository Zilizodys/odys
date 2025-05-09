'use client'

import { useParams } from 'next/navigation'
import ProgramClient from './ProgramClient'

export default function ProgramPage() {
  const params = useParams()
  const id = params.id as string

  return <ProgramClient programId={id} />
} 