"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/firebase/config"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      <div className="w-full max-w-md px-6 py-10 space-y-6 bg-zinc-900 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center">Create GitDock Account</h1>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold transition"
        >
          Sign up with Google
        </button>

        <div className="flex items-center justify-center text-sm text-zinc-400">or continue with email</div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold transition"
        >
          Sign up
        </button>

         <button
      onClick={() => router.push('/')}
      className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold transition"
    >
      Home
    </button>

        <p className="text-sm text-center text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 underline">Sign in</a>
        </p>

        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
      </div>
    </div>
  )
}
