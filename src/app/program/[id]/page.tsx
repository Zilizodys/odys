'use client'

import ProgramClient from './ProgramClient'

export default function ProgramPage({ params }: { params: { id: string } }) {
  return <ProgramClient programId={params.id} />
} 