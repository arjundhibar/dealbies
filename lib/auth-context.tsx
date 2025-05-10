"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import { NextResponse } from "next/server"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkEmailExists: (email: string) => Promise<boolean>
   signInWithGoogle: () => Promise<void>
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

  const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    return data.exists
  } catch (error) {
    console.error("Error checking email:", error)
    return false
  }
}

const signInWithGoogle = async () => {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      setLoading(false)
      return
    }

    // Get the base URL dynamically
    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        "http://localhost:3000/"

      // Make sure to include `https://` when not localhost.
      url = url.includes("http") ? url : `https://${url}`
      // Make sure to include trailing `/`.
      url = url.charAt(url.length - 1) === "/" ? url : `${url}/`

      return url
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}auth/callback`,
      },
    })

    if (error) {
      console.error("Google OAuth Error:", error.message)
      toast({
        title: "OAuth error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      })
    }
  } catch (error: any) {
    console.error("Unexpected error in Google sign-in:", error.message)
    toast({
      title: "OAuth error",
      description: error.message || "Unexpected error during Google login",
      variant: "destructive",
    })
  }
}


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
  if (!supabase) throw new Error("Supabase client not initialized");

  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      throw new Error("Failed to sign in");
    }

    // Get the session using getSession() instead of directly accessing session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error fetching session:", sessionError.message);
      return;
    }

    const session = sessionData?.session;
    if (!session || !session.user) {
      console.error("Session or user not found");
      return;
    }

    // Now, we have the access token in the session
    const accessToken = session.access_token; // Access the token from the session directly
    if (!accessToken) {
      console.error("Access token not found in session");
      return;
    }

    // Now user is authenticated, safe to sync with Neon
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username: data.user.user_metadata.username || email.split("@")[0],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error syncing user to Neon:", errorData.error);
    }
    localStorage.setItem("auth_token", accessToken);
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in",
    });

    router.push("/");
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error.message || "Invalid email or password");
  }
};




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
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, checkEmailExists, signInWithGoogle }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
