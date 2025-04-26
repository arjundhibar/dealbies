"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SignupFormProps {
  onSuccess?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SignupForm({ onSuccess, isOpen, onOpenChange }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUp } = useAuth()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.")
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, username)
      toast({
        title: "Account created!",
        description: "You can now log in with your credentials.",
      })
      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
    } catch (error: any) {
      setError(error.message || "An error occurred during signup.")
    } finally {
      setIsLoading(false)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          You'll receive a confirmation email, but you can log in immediately.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="cooluser123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          minLength={3}
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
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader className="mb-4">
            <SheetTitle>Sign Up</SheetTitle>
            <SheetDescription>Create a new account to start posting deals</SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    )
  }

  return formContent
}
