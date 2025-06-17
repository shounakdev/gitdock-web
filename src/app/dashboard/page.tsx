'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';import { useState } from "react"
import Link from "next/link";



 export default function DashboardPage() {
  const { user, loading } = useAuthRedirect();
  const [showModal, setShowModal] = useState(false)


  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Repositories</h1>
        

        <Link
           href="/create-repo"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold"
        >
        + New Repository
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Repository</h2>
            <input
              type="text"
              placeholder="Repository name"
              className="w-full p-2 rounded bg-gray-800 text-white mb-3"
            />
            <textarea
              placeholder="Description (optional)"
              className="w-full p-2 rounded bg-gray-800 text-white mb-3"
            />
            <div className="flex justify-between items-center mb-4">
              <label>
                <input type="radio" name="visibility" value="public" defaultChecked />
                <span className="ml-2">Public</span>
              </label>
              <label>
                <input type="radio" name="visibility" value="private" />
                <span className="ml-2">Private</span>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Create repo logic goes here")
                  setShowModal(false)
                }}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.displayName || user?.email?.split("@")[0]}</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-sm"
        >
          Sign Out
        </button>
      </header>

      {/* REPO SECTION */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Your Repositories</h2>
        <div className="bg-gray-800 p-4 rounded">
          {/* Placeholder until we connect real data */}
          <p className="text-gray-400">No repositories found. CLI commits will appear here.</p>
        </div>
      </section>

      {/* CLOUD SYNC OPTIONS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Cloud Sync</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded text-white font-semibold">
            Connect Google Drive
          </button>
          <button className="bg-sky-500 hover:bg-sky-600 px-4 py-3 rounded text-white font-semibold">
            Connect OneDrive
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded text-white font-semibold">
            Use Network Storage
          </button>
        </div>
      </section>
    </div>
  );
}