import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programme',
}

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 