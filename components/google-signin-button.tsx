"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function GoogleSignInButton({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)

      // Get the current URL to determine if we're in production or development
      const isProduction = window.location.hostname !== "localhost"

      // Set the redirect URL based on the current environment
      const redirectUrl = isProduction
        ? "https://dealhunter-woad.vercel.app/auth/callback"
        : "http://localhost:3000/auth/callback"

      console.log("Using redirect URL:", redirectUrl)

      // Sign in with Google using the determined redirect URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error("Google sign-in error:", error)
        throw error
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" className={className} onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-5 w-5" />}
      Continue with Google
    </Button>
  )
}
