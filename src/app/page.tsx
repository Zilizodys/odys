import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-white to-gray-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-gray-900">Odys.ai</h1>
        <p className="mt-4 text-xl text-center text-gray-600">Votre compagnon de voyage intelligent</p>
        <p className="mt-2 text-sm text-center text-gray-500">Version 1.0</p>
      </div>
    </main>
  );
}
