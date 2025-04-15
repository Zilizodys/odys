import GenerateForm from '@/components/generate/GenerateForm'
import Header from '@/components/ui/Header'

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Créez votre voyage</h1>
        <GenerateForm />
      </main>
    </div>
  )
} 