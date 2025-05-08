import { Metadata } from 'next'

interface Props {
  children: React.ReactNode
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Programme',
}

export default function ProgramLayout({ children }: Props) {
  return children
} 