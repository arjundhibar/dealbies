import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DealHunter - Find the Best Deals & Coupons",
    template: "%s | DealHunter",
  },
  description:
    "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
  keywords: [
    "deals",
    "discounts",
    "coupons",
    "savings",
    "shopping",
    "retail",
    "electronics",
    "fashion",
    "home goods",
    "online shopping",
  ],
  authors: [{ name: "DealHunter Team" }],
  creator: "DealHunter",
  publisher: "DealHunter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dealbies.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dealbies.com",
    title: "DealHunter - Find the Best Deals & Coupons",
    description:
      "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings.",
    siteName: "DealHunter",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DealHunter - Find the Best Deals & Coupons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DealHunter - Find the Best Deals & Coupons",
    description:
      "Discover amazing deals, discounts, and coupons from top retailers.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#e9eaec] dark:bg-dark-primary`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
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
                        <span className="text-sm text-muted-foreground">
                          © {new Date().getFullYear()}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <a
                          href="#"
                          className="hover:text-foreground hover:underline"
                        >
                          About
                        </a>
                        <a
                          href="#"
                          className="hover:text-foreground hover:underline"
                        >
                          Privacy
                        </a>
                        <a
                          href="#"
                          className="hover:text-foreground hover:underline"
                        >
                          Terms
                        </a>
                        <a
                          href="#"
                          className="hover:text-foreground hover:underline"
                        >
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
  );
}
