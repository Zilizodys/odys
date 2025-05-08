import { Metadata } from 'next'

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Programme ${params.id}`,
  }
}

export default function ProgramLayout({ children }: Props) {
  return children
} 