"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function SignupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  useEffect(() => {
    if (user && !loading) {
      router.push(redirect)
    }
  }, [user, loading, router, redirect])

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-6 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-40 mx-auto" />
            <Skeleton className="h-4 w-60 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-6 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Sign up to start sharing and discovering deals</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm onSuccess={() => router.push(redirect)} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="text-primary hover:underline"
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
