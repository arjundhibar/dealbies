"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Home,
  ArrowLeft,
  ShoppingBag,
  Ticket,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Plus,
} from "lucide-react";

export default function Custom404() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: "Hot Deals",
      description: "Discover the hottest deals",
      href: "/deals",
      icon: TrendingUp,
      color: "text-orange-500",
    },
    {
      title: "Discount Codes",
      description: "Find discount codes",
      href: "/coupons",
      icon: Ticket,
      color: "text-green-500",
    },
    {
      title: "Store Directory",
      description: "Browse all stores",
      href: "/store",
      icon: ShoppingBag,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main 404 Content */}
        <div className="text-center mb-12">
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-orange-500 dark:text-orange-400 opacity-20">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="h-24 w-24 text-orange-500 dark:text-orange-400" />
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The page you're looking for seems to have vanished into the digital
            void. Don't worry, we'll help you find what you need!
          </p>

          {/* Search Bar */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for deals, coupons, or stores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Link href="/">
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`mx-auto mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800 w-fit group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className={`h-8 w-8 ${link.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {link.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {link.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={link.href} className="flex items-center gap-2">
                      Explore
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Popular Categories */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Electronics",
              "Fashion",
              "Home & Garden",
              "Sports",
              "Beauty",
              "Books",
              "Automotive",
              "Health",
            ].map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                onClick={() =>
                  router.push(
                    `/category/${category.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Still Can't Find What You're Looking For?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our community is here to help! Join discussions, ask questions,
                or share your own deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/discussion">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Discussion
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/submission/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Deal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
