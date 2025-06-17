'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold">Welcome to GitDock </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          A modern Git-like version control platform with web UI, cloud sync, and collaboration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white text-lg"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/docs')}
            className="border border-white px-6 py-3 rounded-lg text-lg hover:bg-white hover:text-black transition"
          >
            Read Docs
          </button>
        </div>
      </div>

      <footer className="mt-20 text-gray-400 text-sm">
        Made by Shounak | Hosted on Vercel
      </footer>
    </div>
  );
}
