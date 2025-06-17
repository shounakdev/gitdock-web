"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/firebase/config"
import { collection, addDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/config"

export default function CreateRepoPage() {
  const router = useRouter()
  const [user, loading, authError] = useAuthState(auth)

  const [repoName, setRepoName] = useState("")
  const [collaborators, setCollaborators] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log("Auth state:", { user: user?.uid, loading, authError })
  }, [user, loading, authError])

const handleNext = async () => {
  console.log("handleNext called")
  setError("")
  setIsSubmitting(true)

  if (!repoName.trim()) {
    setError("Repository name is required")
    setIsSubmitting(false)
    return
  }

  if (loading) {
    setError("Please wait while we verify your authentication")
    setIsSubmitting(false)
    return
  }

  if (!user) {
    setError("You must be logged in to create a repository")
    setIsSubmitting(false)
    return
  }

  try {
    console.log("Creating repository...")

    const repoData = {
      name: repoName.trim(),
      createdBy: user.uid,
      collaborators: collaborators
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      isPrivate,
      createdAt: new Date(),
    }

    console.log("Repository data:", repoData)

    const repoRef = await addDoc(collection(db, "repositories"), repoData)
    console.log("Repository created successfully with ID:", repoRef.id)

    // Safeguard for navigation after Firebase write
    setTimeout(() => {
      router.push(`/repo-storage-setup?repoId=${repoRef.id}`)
    }, 300)
  } catch (err: any) {
    console.error("Error creating repository:", err)
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      stack: err.stack,
    })

    // Handle fallback if Firebase fails
    const fallbackTrigger =
      err.code === "unavailable" ||
      err.code === "resource-exhausted" ||
      err.message?.toLowerCase().includes("transport") ||
      err.message?.toLowerCase().includes("stream") ||
      err.message?.toLowerCase().includes("network") ||
      err.message?.toLowerCase().includes("400") ||
      err.message?.toLowerCase().includes("load resource")

    if (fallbackTrigger) {
      console.warn("Triggering fallback mode due to Firebase error")

      const tempRepoId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const fallbackData = {
        id: tempRepoId,
        name: repoName.trim(),
        createdBy: user.uid,
        collaborators: collaborators
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        isPrivate,
        createdAt: new Date(),
        isFallback: true,
        timestamp: Date.now(),
      }

      localStorage.setItem(`repo_${tempRepoId}`, JSON.stringify(fallbackData))
      console.log("Stored fallback repo data:", fallbackData)

      setTimeout(() => {
        router.push(`/repo-storage-setup?repoId=${tempRepoId}&fallback=true`)
      }, 300)
      return
    }

    // Handle known errors
    if (err.code === "permission-denied") {
      setError("You don't have permission to create repositories. Please check your authentication.")
    } else if (err.code === "failed-precondition") {
      setError("Database configuration error. Please contact support.")
    } else {
      setError(`Firebase Error: ${err.message || "An error occurred while creating the repository."}`)
    }
  } finally {
    setIsSubmitting(false)
  }
}


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
        <div className="bg-gray-950 p-6 rounded-xl w-full max-w-md shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error if authentication failed
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
        <div className="bg-gray-950 p-6 rounded-xl w-full max-w-md shadow-lg">
          <div className="text-center">
            <p className="text-red-400 mb-4">Authentication Error: {authError.message}</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
      <div className="bg-gray-950 p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
        <h1 className="text-2xl font-bold">Create New Repository</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="repoName" className="block text-sm font-medium mb-2">
              Repository Name *
            </label>
            <input
              id="repoName"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Enter repository name"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="collaborators" className="block text-sm font-medium mb-2">
              Collaborators (optional)
            </label>
            <input
              id="collaborators"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Enter email addresses separated by commas"
              value={collaborators}
              onChange={(e) => setCollaborators(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  disabled={isSubmitting}
                  className="text-blue-600"
                />
                <span>Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  disabled={isSubmitting}
                  className="text-blue-600"
                />
                <span>Private</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {user && <div className="text-sm text-gray-400">Creating as: {user.email}</div>}

        <button
          onClick={handleNext}
          disabled={isSubmitting || !repoName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-md text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating...
            </>
          ) : (
            "Next →"
          )}
        </button>

        {/* Debug info */}
        <div className="text-xs text-gray-500 mt-4">
          <p>Debug: User ID: {user?.uid}</p>
          <p>Firebase Project: gitdock-2e74d</p>
        </div>
      </div>
    </div>
  )
}
