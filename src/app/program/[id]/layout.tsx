import { Metadata } from 'next'

type LayoutProps = {
  children: React.ReactNode
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  return {
    title: `Programme ${params.id}`,
  }
}

export default function ProgramLayout({ children }: LayoutProps) {
  return children
} 