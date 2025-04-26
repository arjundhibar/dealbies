"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabase()

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client not initialized")
          setLoading(false)
          return
        }

        // Get initial session
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
        }

        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
          console.log("Auth state changed:", _event, newSession?.user?.email)
          setSession(newSession)
          setUser(newSession?.user ?? null)
          router.refresh()
        })

        setLoading(false)
        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error getting user:", error)
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase])

  // Make sure the signUp function properly creates a user with Supabase
  const signUp = async (email: string, password: string, username: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Create user in our database
      if (data.user) {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create user in database")
          }
        } catch (createError) {
          console.error("Error creating user in database:", createError)
          // If we fail to create the user in our database, we should still continue
          // as the user was created in Supabase Auth
        }

        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account before logging in.",
        })
      }
    } catch (error: any) {
      console.error("Error signing up:", error)
      throw new Error(error.message || "An error occurred during signup")
    }
  }

  // Make sure the signIn function properly authenticates with Supabase
  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not initialized")

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If email is not confirmed, try to resend the confirmation email
        if (error.message.includes("Email not confirmed")) {
          const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email,
          })

          if (resendError) {
            throw new Error("Failed to resend confirmation email. Please try again later.")
          }

          throw new Error("Please check your email for the confirmation link. We've resent it to you.")
        }
        throw error
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in",
      })

      router.push("/")
    } catch (error: any) {
      console.error("Error signing in:", error)
      throw new Error(error.message || "Invalid email or password")
    }
  }

  const signOut = async () => {
    if (!supabase) throw new Error("Supabase client not initialized")

    try {
      await supabase.auth.signOut()
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "An error occurred while signing out",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
