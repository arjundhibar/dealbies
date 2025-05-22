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
import { Loader2, X } from "lucide-react"
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

export function UnifiedAuthForm({ defaultStep = "email", onOpenChange }: UnifiedAuthFormProps) {
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
    <div className="p-2 relative">
      {/* Logo and close button */}
      

      {/* Title */}
      {/* <h1 className="text-3xl font-bold mb-2">Log in or register</h1>
      <p className="text-lg mb-8">Become part of the world's largest deals community!</p> */}
      
      {step === "email" && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username or email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        >
                          <circle cx="12" cy="8" r="5" />
                          <path d="M20 21a8 8 0 0 0-16 0" />
                        </svg>
                      </div>
                      <Input placeholder="johndoe@example.com or johndoe" {...field} className="pl-10 py-6 text-base" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#E86C2A] hover:bg-[#D15E20] rounded-full text-white py-6 text-lg"
              disabled={isCheckingEmail}
            >
              {isCheckingEmail ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : (
                "Further"
              )}
            </Button>

            {/* <div className="my-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow  border-gray-300"></div>
              </div>
            </div> */}

            <div className="space-y-3">
              <GoogleSignInButton className="w-full flex items-center justify-center gap-2 py-5 border border-gray-300 rounded-full text-base font-medium" />

              {/* <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-5 border border-gray-300 rounded-full text-base font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.5 16.5H11V11H12.5V16.5ZM12 9.5C11.448 9.5 11 9.052 11 8.5C11 7.948 11.448 7.5 12 7.5C12.552 7.5 13 7.948 13 8.5C13 9.052 12.552 9.5 12 9.5Z" />
                </svg>
                Continue with Apple
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-5 border border-gray-300 rounded-full text-base font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                </svg>
                Continue with Facebook
              </Button> */}
            </div>
          </form>
        </Form>
      )}

      {step === "login" && (
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSubmitLogin)} className="space-y-6">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="py-6 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#E86C2A] hover:bg-[#D15E20] text-white py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>

            <div className="my-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>

            <div className="space-y-3">
              <GoogleSignInButton className="w-full flex items-center justify-center gap-2 py-5 border border-gray-300 rounded-full text-base font-medium" />
            </div>

            <Button variant="link" onClick={() => setStep("email")} className="w-full mt-4">
              Back to Email
            </Button>
          </form>
        </Form>
      )}

      {step === "signup" && (
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="space-y-6">
            <FormField
              control={signupForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} className="py-6 text-base" />
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
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="py-6 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#E86C2A] hover:bg-[#D15E20] text-white py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <Button variant="link" onClick={() => setStep("email")} className="w-full mt-4">
              Back to Email
            </Button>
          </form>
        </Form>
      )}
      </div>
  )
}
