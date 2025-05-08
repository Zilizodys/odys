'use client'

import ProgramClient from './ProgramClient'

type ProgramPageProps = {
  params: { id: string }
}

export default function ProgramPage({ params }: ProgramPageProps) {
  return <ProgramClient programId={params.id} />
} 