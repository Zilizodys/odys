import GenerateForm from '@/components/generate/GenerateForm'

export default function GeneratePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col justify-between max-w-2xl w-full mx-auto px-4 pb-24">
        <GenerateForm />
      </main>
    </div>
  )
} 