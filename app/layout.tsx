import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import { Navbar } from "@/components/navbar";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

// Helper function to get site settings
async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "site-settings" },
    });

    // If settings don't exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "site-settings",
          siteTitle: "DealHunter - Find the Best Deals & Coupons",
          metaDescription:
            "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
          siteName: "DealHunter",
          ogImage: "/og-image.jpg",
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return default values if there's an error
    return {
      siteTitle: "DealHunter - Find the Best Deals & Coupons",
      metaDescription:
        "Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.",
      siteName: "DealHunter",
      ogImage: "/og-image.jpg",
    };
  }
}

// Generate metadata dynamically from database
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ogImageUrl = settings.ogImage?.startsWith("http")
    ? settings.ogImage
    : `https://dealbies.com${settings.ogImage || "/og-image.jpg"}`;

  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.metaDescription,
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
    authors: [{ name: settings.siteName + " Team" }],
    creator: settings.siteName,
    publisher: settings.siteName,
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
      title: settings.siteTitle,
      description: settings.metaDescription,
      siteName: settings.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: settings.siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.metaDescription,
      images: [ogImageUrl],
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
}

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
