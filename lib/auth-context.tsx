"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase, getSupabaseAdmin, isNetworkError } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (isNetworkError(error) && i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
  checkUserExists: (emailOrUsername: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabase();

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client not initialized");
          setLoading(false);
          return;
        }

        // Get initial session with retry logic for network errors
        try {
          const {
            data: { session: initialSession },
            error: sessionError,
          } = await retryWithBackoff(
            () => supabase.auth.getSession(),
            2, // Max 2 retries
            1000 // Initial delay 1 second
          );

          if (sessionError) {
            // Only log non-network errors
            if (!isNetworkError(sessionError)) {
              console.error("Error getting session:", sessionError);
            } else {
              console.warn(
                "Network error getting session, will retry on next auth state change"
              );
            }
          }

          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        } catch (error: any) {
          // If it's a network error, keep existing session if available
          if (isNetworkError(error)) {
            console.warn(
              "Network error during session fetch, using cached session if available"
            );
            // Try to get session from localStorage as fallback
            try {
              const storedSession = localStorage.getItem("sb-auth-token");
              if (storedSession) {
                const parsed = JSON.parse(storedSession);
                if (parsed?.session) {
                  setSession(parsed.session);
                  setUser(parsed.session.user);
                }
              }
            } catch {
              // Ignore localStorage errors
            }
          } else {
            console.error("Error getting session:", error);
          }
        }

        // Set up auth state listener with error handling
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          // Handle token refresh errors gracefully
          if (event === "TOKEN_REFRESHED" && !newSession) {
            // Token refresh failed, but don't clear session immediately
            console.warn("Token refresh failed, keeping existing session");
            return;
          }

          setSession(newSession);
          setUser(newSession?.user ?? null);

          // If user is logged in, check their role and redirect accordingly
          if (newSession?.user) {
            try {
              // Fetch user role from your database with retry
              const response = await retryWithBackoff(
                () =>
                  fetch("/api/admin/verify", {
                    headers: {
                      Authorization: `Bearer ${newSession.access_token}`,
                    },
                  }),
                2,
                500
              );

              if (response.ok) {
                const { role } = await response.json();

                // Check if user is on admin page but not admin
                if (
                  role !== "ADMIN" &&
                  window.location.pathname.startsWith("/admin")
                ) {
                  router.push("/");
                }
              }
            } catch (error) {
              // Only log non-network errors
              if (!isNetworkError(error)) {
                console.error("Error fetching user role:", error);
              }
            }
          }

          router.refresh();
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error getting user:", error);
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);
  // In your AuthProvider component
  useEffect(() => {
    // Check if user is on an admin page but isn't an admin
    const checkAdminAccess = async () => {
      // Only run this check if on an admin page
      if (window.location.pathname.startsWith("/admin")) {
        // If no user or session, redirect immediately
        if (!user || !session) {
          router.push("/");
          return;
        }

        // Check if the user is an admin
        try {
          const response = await fetch("/api/admin/verify", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            router.push("/");
            return;
          }

          const { role } = await response.json();
          if (role !== "ADMIN") {
            router.push("/");
          }
        } catch (error) {
          console.error("Error checking admin access:", error);
          router.push("/");
        }
      }
    };

    checkAdminAccess();
  }, [user, session, router]); // Run this effect when user or session changes

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/check-email?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const checkUserExists = async (emailOrUsername: string): Promise<boolean> => {
    try {
      // Check if input contains @ symbol to determine if it's an email
      const isEmail = emailOrUsername.includes("@");
      const endpoint = isEmail
        ? `/api/check-email?email=${encodeURIComponent(emailOrUsername)}`
        : `/api/check-username?username=${encodeURIComponent(emailOrUsername)}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!supabase) {
        console.error("Supabase client not initialized");
        setLoading(false);
        return;
      }
      const redirectTo =
        process.env.NODE_ENV === "production"
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
          : "http://localhost:3000/auth/callback";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error("Google OAuth Error:", error.message);
        toast({
          title: "OAuth error",
          description: "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error in Google sign-in:", error.message);
      toast({
        title: "OAuth error",
        description: error.message || "Unexpected error during Google login",
        variant: "destructive",
      });
    }
  };

  // Make sure the signUp function properly creates a user with Supabase
  const signUp = async (email: string, password: string, username: string) => {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        return;
      }
      const login = await supabase.auth.signInWithPassword({ email, password });
      const token = login.data.session?.access_token;

      // Don't try to get session or call /api/users here,
      // because the user needs to confirm email and won't have a session yet.

      if (token) {
        await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });
      }
      toast({
        title: "Account created!",
        description:
          "Please check your email to confirm your account before logging in.",
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      throw new Error(error.message || "An error occurred during signup");
    }
  };

  // Make sure the signIn function properly authenticates with Supabase
  const signIn = async (emailOrUsername: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes("@");
      let email = emailOrUsername;

      // If username, get the email via API
      if (!isEmail) {
        try {
          const response = await retryWithBackoff(
            () =>
              fetch(
                `/api/get-email?username=${encodeURIComponent(emailOrUsername)}`
              ),
            2,
            500
          );
          if (!response.ok) {
            throw new Error("Invalid username or password");
          }
          const data = await response.json();
          email = data.email;
        } catch (error: any) {
          if (isNetworkError(error)) {
            throw new Error(
              "Network error: Please check your internet connection and try again"
            );
          }
          throw new Error("Invalid username or password");
        }
      }

      // Sign in with email & password with retry
      const { error, data } = await retryWithBackoff(
        () =>
          supabase.auth.signInWithPassword({
            email,
            password,
          }),
        2,
        1000
      );

      if (error) {
        if (isNetworkError(error)) {
          throw new Error(
            "Network error: Please check your internet connection and try again"
          );
        }
        console.error("Error signing in:", error.message);
        throw new Error("Invalid email or password");
      }

      // Fetch session after sign in with retry
      const { data: sessionData, error: sessionError } = await retryWithBackoff(
        () => supabase.auth.getSession(),
        2,
        1000
      );
      if (sessionError || !sessionData?.session || !sessionData.session.user) {
        if (isNetworkError(sessionError)) {
          throw new Error(
            "Network error: Please check your internet connection and try again"
          );
        }
        throw new Error("Failed to retrieve session after login");
      }

      const session = sessionData.session;
      const accessToken = session.access_token;
      if (!accessToken) {
        throw new Error("Access token not found in session");
      }
      console.log("this is access token", accessToken);

      // Sync user to your database with retry
      try {
        const syncResponse = await retryWithBackoff(
          () =>
            fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                username:
                  data.user?.user_metadata?.username || email.split("@")[0],
              }),
            }),
          2,
          500
        );

        if (!syncResponse.ok) {
          const errorData = await syncResponse.json();
          console.error("Error syncing user to database:", errorData.error);
          // Optionally, you can throw here or ignore to allow login anyway
        }
      } catch (error: any) {
        // Don't fail login if sync fails due to network error
        if (!isNetworkError(error)) {
          console.error("Error syncing user:", error);
        }
      }

      // Save token for later use
      localStorage.setItem("auth_token", accessToken);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in",
      });

      try {
        const roleResponse = await retryWithBackoff(
          () =>
            fetch("/api/admin/verify", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
          2,
          500
        );

        if (roleResponse.ok) {
          const { role } = await roleResponse.json();
          if (role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
        }
      } catch (error: any) {
        // Don't fail login if role check fails due to network error
        if (!isNetworkError(error)) {
          console.error("Error checking role:", error);
        }
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      // Provide user-friendly error messages
      if (isNetworkError(error)) {
        toast({
          title: "Network Error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
        throw new Error(
          "Network error: Please check your internet connection and try again"
        );
      }
      throw new Error(error.message || "Invalid email or password");
    }
  };

  const signOut = async () => {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        checkEmailExists,
        checkUserExists,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
