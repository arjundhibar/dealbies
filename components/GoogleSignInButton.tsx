// components/GoogleSignInButton.tsx
"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface GoogleSignInButtonProps {
  id?: string
}

export default function GoogleSignInButton({ id }: GoogleSignInButtonProps) {
  const supabase = createClientComponentClient()

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("Google sign-in error:", error.message)
    }
  }

  return (
    <button id={id} onClick={handleGoogleSignIn} className="hidden">
      Sign in with Google
    </button>
  )
}
