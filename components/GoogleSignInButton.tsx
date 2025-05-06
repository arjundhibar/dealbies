// components/GoogleSignInButton.tsx
"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function GoogleSignInButton() {
  const supabase = createClientComponentClient()

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, 
      },
    })

    if (error) {
      console.error("Google sign-in error:", error.message)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  )
}
