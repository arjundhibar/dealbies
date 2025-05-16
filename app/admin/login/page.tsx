  "use client"

  import type React from "react"

  import { useState, FormEvent } from "react"
  import { useRouter, useSearchParams } from "next/navigation"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Alert, AlertDescription } from "@/components/ui/alert"
  import { AlertCircle } from "lucide-react"
  import { getSupabase } from "@/lib/supabase"
  import { NextResponse } from "next/server"
  import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

  export default function AdminLoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => { // Use FormEvent
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      // try {
      //   const { data, error: signInError } = await supabase.auth.signInWithPassword({
      //     email,
      //     password,
      //   });
  
      //   if (signInError) {
      //     setError(signInError.message);
      //     setLoading(false);
      //     return;
      //   }
  
      //   if (!data.session) {
      //     setError("Login failed: No session data received.");
      //     setLoading(false);
      //     return;
      //   }
  
      //   // Verify admin role via your API
      //   const res = await fetch("/api/admin/verify", {
      //     headers: { Authorization: `Bearer ${data.session.access_token}` },
      //   });
  
      //   if (!res.ok) {
      //     const errorData = await res.json().catch(() => ({ message: "Failed to verify admin role. Invalid server response." }));
      //     setError(errorData.message || "Failed to verify admin role");
      //     await supabase.auth.signOut(); // Sign out if role verification fails
      //     setLoading(false);
      //     return;
      //   }
  
      //   const { role } = await res.json();
      //   if (role !== "ADMIN") {
      //     setError("You are not authorized to access the admin panel.");
      //     await supabase.auth.signOut(); // Sign out if not an admin
      //     setLoading(false);
      //     return;
      //   }
  
      //   // Update user metadata with the role. This is important for the middleware to read.
      //   // This updates `user_metadata` by default from client-side.
      //   const { error: updateUserError } = await supabase.auth.updateUser({
      //     data: { role: "ADMIN" }, // Ensure role is correctly stored, e.g., in user_metadata
      //   });
  
      //   if (updateUserError) {
      //     setError(`Failed to update user role: ${updateUserError.message}`);
      //     // Decide if you want to sign out here or proceed with caution
      //     // await supabase.auth.signOut();
      //     setLoading(false);
      //     return;
      //   }
  
      //   // --- REMOVED manual cookie setting ---
      //   // --- REMOVED supabase.auth.setSession (handled by signInWithPassword) ---
  
      //   // Redirect after successful login and role verification/update
      //   const redirectedFrom = searchParams.get('redirectedFrom');
      //   router.push(redirectedFrom || '/admin');
      //   router.refresh(); // VERY IMPORTANT: This re-fetches server components and re-runs middleware
  
      // } catch (err: any) { // Catch specific error type if known
      //   console.error("Login error:", err);
      //   setError(err.message || "An unexpected error occurred during login.");
      // } finally {
      //   setLoading(false);
      // }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
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
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }
