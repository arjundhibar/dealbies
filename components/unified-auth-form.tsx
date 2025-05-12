"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import GoogleSignInButton from "./google-signin-button"
import { useAuth } from "@/lib/auth-context"

const emailSchema = z.object({
  email: z.string().min(3, {
    message: "Please enter a valid email or username.",
  }),
})

const passwordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type Steps = "email" | "login" | "signup"

interface UnifiedAuthFormProps {
  defaultStep?: Steps
  onSuccess?: () => void
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export function UnifiedAuthForm({ defaultStep = "email" }: UnifiedAuthFormProps) {
  const [step, setStep] = useState<Steps>(defaultStep)
  const [email, setEmail] = useState<string>("")
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const auth = useAuth()

  // Email Form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmitEmail(values: z.infer<typeof emailSchema>) {
    setIsCheckingEmail(true)
    try {
      const { email } = values
      setEmail(email)

      // Use the checkUserExists function from auth context
      const exists = await auth.checkUserExists(email)

      // Navigate to login if user exists, signup if not
      setStep(exists ? "login" : "signup")
    } catch (error) {
      console.error("Error checking user:", error)
      toast({
        title: "Error",
        description: "Failed to check user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Password Form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  })

  // Signup Form with username and password
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmitLogin(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    try {
      await auth.signIn(email, values.password)
      // No need for toast here as it's handled in the signIn function
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitSignup(values: z.infer<typeof signupSchema>) {
    setIsLoading(true)
    try {
      await auth.signUp(email, values.password, values.username)
      // No need for toast here as it's handled in the signUp function
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {step === "email" && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="grid gap-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com or johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton className="w-full flex items-center justify-center gap-2" />
          </form>
        </Form>
      )}

      {step === "login" && (
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSubmitLogin)} className="grid gap-4">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton className="w-full flex items-center justify-center gap-2" />
          </form>
        </Form>
      )}

      {step === "signup" && (
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="grid gap-4">
            <FormField
              control={signupForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      )}

      {step !== "email" && (
        <Button variant="link" onClick={() => setStep("email")}>
          Back to Email
        </Button>
      )}

      {/* {step === "login" && (
        <Button variant="link" onClick={() => setStep("signup")}>
          Create an account
        </Button>
      )} */}
    </div>
  )
}
