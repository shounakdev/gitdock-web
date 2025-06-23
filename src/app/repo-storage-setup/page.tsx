"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/config"

function RepoStorageSetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, loading, authError] = useAuthState(auth)

  const repoId = searchParams.get("repoId")
  const isFallback = searchParams.get("fallback") === "true"
  const [storageOption, setStorageOption] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const triggerLocalRepoCreation = async () => {
  const res = await fetch("/api/storage/create-local-repo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repoId: repoData.id,
      repoName: repoData.name,
    }),
  });

  const data = await res.json();
  console.log("Local repo creation result:", data);
};


  const [repoData, setRepoData] = useState<any>(null)
  const [networkPath, setNetworkPath] = useState("");


  // Load repository data on mount
  useEffect(() => {
    if (!repoId) {
      setError("No repository ID provided")
      return
    }

    const loadRepoData = async () => {
      if (isFallback) {
        // Load from localStorage for fallback
        const fallbackData = localStorage.getItem(`repo_${repoId}`)
        if (fallbackData) {
          const data = JSON.parse(fallbackData)
          setRepoData(data)
          console.log("Loaded fallback repo data:", data)
        } else {
          setError("Repository data not found")
        }
      } else {
        // Try to load from Firebase
        try {
          const docRef = doc(db, "repositories", repoId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setRepoData({ id: docSnap.id, ...docSnap.data() })
            console.log("Loaded repo data from Firebase:", docSnap.data())
          } else {
            setError("Repository not found")
          }
        } catch (err: any) {
          console.error("Error loading repository:", err)
          setError(`Error loading repository: ${err.message}`)
        }
      }
    }

    loadRepoData()
  }, [repoId, isFallback])

  const handleContinue = async () => {
    if (!repoId || !user) {
      setError("Missing repository ID or user not logged in.")
      return
    }

    if (!storageOption) {
      setError("Please select a storage option.")
      return
    }

    setIsSubmitting(true)

    try {
      if (isFallback) {
        // Update localStorage for fallback
        const existingData = localStorage.getItem(`repo_${repoId}`)
        if (existingData) {
          const data = JSON.parse(existingData)
          data.storage = storageOption
          data.updatedAt = new Date().toISOString()
          localStorage.setItem(`repo_${repoId}`, JSON.stringify(data))
          console.log("Updated fallback repo data:", data)
        }
      } else {
        // Update Firebase
        await updateDoc(doc(db, "repositories", repoId), {
          storage: storageOption,
          updatedAt: new Date(),
        })
        console.log("Updated repository in Firebase")
      }

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error updating repository:", err)
      setError(`Error updating repository: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
        <div className="bg-gray-950 p-6 rounded-xl w-full max-w-md shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Auth error
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
        <div>
          <h1 className="text-2xl font-bold">Select Storage Option</h1>
          {repoData && (
            <p className="text-sm text-gray-400 mt-2">
              Repository: {repoData.name}
              {isFallback && <span className="text-yellow-400 ml-2">(Offline Mode)</span>}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {[
            { value: "googleDrive", label: "Google Drive", description: "Store files in Google Drive" },
            { value: "oneDrive", label: "OneDrive", description: "Store files in Microsoft OneDrive" },
            { value: "defaultPath", label: "Default Path", description: "Use default local storage" },
            { value: "networkPath", label: "Network Path", description: "Use network storage location" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <input
                type="radio"
                name="storage"
                value={option.value}
                checked={storageOption === option.value}
                onChange={() => setStorageOption(option.value)}
                disabled={isSubmitting}
                className="mt-1 text-blue-600"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-400">{option.description}</div>
              </div>
            </label>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isFallback && (
          <div className="p-3 bg-yellow-900/50 border border-yellow-500 rounded-md">
            <p className="text-yellow-400 text-sm">
              ⚠️ Running in offline mode. Data will be synced when connection is restored.
            </p>
          </div>
        )}

        {storageOption === "networkPath" && (
  <>
    <label className="text-sm font-medium mt-2">Enter network/local path</label>
    <input
      type="text"
      value={networkPath}
      onChange={(e) => setNetworkPath(e.target.value)}
      placeholder="e.g. /home/user/gitdock-test"
      className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-sm text-white mt-1"
    />

    <button
      onClick={triggerLocalRepoCreation}
      className="w-full mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-semibold"
    >
      Create on Local Drive
    </button>
  </>
)}


        {storageOption === "networkPath" && (
  <button
    onClick={triggerLocalRepoCreation}
    className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-semibold"
  >
    Create on Local Drive
  </button>
)}


        <button
          onClick={handleContinue}
          disabled={isSubmitting || !storageOption}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-md text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            "Continue"
          )}
        </button>

        {/* Debug info */}
        <div className="text-xs text-gray-500 mt-4">
          <p>Repository ID: {repoId}</p>
          <p>Mode: {isFallback ? "Offline" : "Online"}</p>
          <p>User: {user?.email}</p>
        </div>
      </div>
    </div>
  )
}

export default function RepoStorageSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
          <div className="bg-gray-950 p-6 rounded-xl w-full max-w-md shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <RepoStorageSetupContent />
    </Suspense>
  )
}
