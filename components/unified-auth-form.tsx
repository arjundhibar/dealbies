"use client"

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

const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const passwordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})



type Steps = "email" | "login" | "signup"

interface UnifiedAuthFormProps {
  defaultStep?: Steps
}

export function UnifiedAuthForm({ defaultStep = "email" }: UnifiedAuthFormProps) {
  const [step, setStep] = useState<Steps>(defaultStep)
  const [email, setEmail] = useState<string>("")
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Email Form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmitEmail(values: z.infer<typeof emailSchema>) {
    setIsCheckingEmail(true)
    // Simulate checking email
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsCheckingEmail(false)
    setEmail(values.email)
    setStep("login")
  }

  // Password Form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  })

  async function onSubmitLogin(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Login Successful",
      description: "You are now logged in.",
    })
  }

  async function onSubmitSignup(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Signup Successful",
      description: "Your account has been created.",
    })
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn@example.com" {...field} />
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
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSubmitSignup)} className="grid gap-4">
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

      {step === "login" && (
        <Button variant="link" onClick={() => setStep("signup")}>
          Create an account
        </Button>
      )}
    </div>
  )
}
