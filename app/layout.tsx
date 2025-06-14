import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DealHunter - Find the Best Deals",
  description: "A community-powered deals platform",
  generator: "Kishan",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#e9eaec] dark:bg-dark-primary`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DataProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 py-4">
                  <div className=" md:mx-[110px] mx-0 ">{children}</div>
                </main>
                <footer className="border-t bg-white py-6 dark:bg-dark-secondary">
                  <div className="mx-[110px] md:mx-[110px]">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">DealHunter</span>
                        <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground hover:underline">
                          About
                        </a>
                        <a href="#" className="hover:text-foreground hover:underline">
                          Privacy
                        </a>
                        <a href="#" className="hover:text-foreground hover:underline">
                          Terms
                        </a>
                        <a href="#" className="hover:text-foreground hover:underline">
                          Contact
                        </a>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
