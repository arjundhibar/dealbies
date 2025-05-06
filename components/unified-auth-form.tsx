"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import GoogleSignInButton from "./GoogleSignInButton"

interface UnifiedAuthFormProps {
  onSuccess?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UnifiedAuthForm({ onSuccess, isOpen, onOpenChange }: UnifiedAuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"email" | "login" | "signup">("email")
  const { signIn, signUp, checkEmailExists } = useAuth()
  const { toast } = useToast()

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmail("")
      setPassword("")
      setUsername("")
      setError(null)
      setStep("email")
    }
  }, [isOpen])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setError(null)
    setIsCheckingEmail(true)

    try {
      // Check if email exists in your authentication system
      const exists = await checkEmailExists(email)

      if (exists) {
        setStep("login")
      } else {
        setStep("signup")
      }
    } catch (error: any) {
      setError("Error checking email. Please try again.")
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
    } catch (error: any) {
      setError(error.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signUp(email, password, username)
      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
      toast({
        title: "Account created successfully!",
        description: "Welcome to DealHunter.",
      })
    } catch (error: any) {
      setError(error.message || "Error creating account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isCheckingEmail}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isCheckingEmail}>
            {isCheckingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      )}

      {step === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setStep("email")}>
                Use different email
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
                  </Button>
                  
        </form>
      )}

      {step === "signup" && (
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled />
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setStep("email")}>
              Use different email
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
