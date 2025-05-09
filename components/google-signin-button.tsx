"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function GoogleSignInButton({ className = "" }: { className?: string }) {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      // The redirect will be handled by Supabase, so we don't need to do anything else here
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
