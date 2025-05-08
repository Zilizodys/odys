'use client'

import { Metadata } from 'next'
import ProgramClient from './ProgramClient'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProgramPage({ params }: Props) {
  return <ProgramClient programId={params.id} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Programme ${params.id}`,
  }
} 