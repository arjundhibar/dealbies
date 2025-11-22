"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Percent, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Merchant {
  name: string;
  dealCount: number;
  couponCount: number;
  totalVotes: number;
}

export default function StoresPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetMerchants {
                merchants {
                  name
                  dealCount
                  couponCount
                  totalVotes
                }
              }
            `,
          }),
        });

        const { data } = await response.json();
        if (data?.merchants) {
          setMerchants(data.merchants);
          setFilteredMerchants(data.merchants);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMerchants(merchants);
    } else {
      const filtered = merchants.filter((merchant) =>
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMerchants(filtered);
    }
  }, [searchQuery, merchants]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="max-w-[82.5rem] mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="bg-orange-500 h-64 rounded-lg mb-8"></div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 dark:bg-gray-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full -mt-7">
      <div className="max-w-[82.5rem] mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-12 mb-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            DealHunter.com - save with discount codes at online stores
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover the hottest discount codes from your favorite online store
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for webshop"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-6 pr-14 text-lg bg-white text-gray-900 placeholder-gray-500 border-0 rounded-full shadow-lg"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-2 h-10 w-10 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>
          </form>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              We may earn a commission when you buy through our links.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Verified discount codes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Our discount code hunters are always searching for the best codes.
              Check out today's selection here!
            </p>
          </div>

          {/* Merchants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <Card
                key={merchant.name}
                className="group hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-0">
                  <Link href={`/store/${encodeURIComponent(merchant.name)}`}>
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-lg overflow-hidden">
                      {/* Placeholder for merchant image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                            {merchant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Merchant logo overlay */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded shadow-sm">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {merchant.name.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="secondary" className="text-xs">
                          {merchant.couponCount > 0
                            ? "Discount code"
                            : "Discount"}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {merchant.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        {merchant.couponCount > 0 && (
                          <span className="text-orange-500 font-bold">
                            {merchant.couponCount} discount code
                            {merchant.couponCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {merchant.dealCount > 0 && (
                          <span className="text-orange-500 font-bold">
                            {merchant.dealCount} deal
                            {merchant.dealCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {merchant.couponCount > 0 && merchant.dealCount > 0
                          ? `Get ${merchant.couponCount} discount code${
                              merchant.couponCount > 1 ? "s" : ""
                            } and ${merchant.dealCount} deal${
                              merchant.dealCount > 1 ? "s" : ""
                            } at ${merchant.name}`
                          : merchant.couponCount > 0
                          ? `Get ${merchant.couponCount} discount code${
                              merchant.couponCount > 1 ? "s" : ""
                            } at ${merchant.name}`
                          : `Find ${merchant.dealCount} deal${
                              merchant.dealCount > 1 ? "s" : ""
                            } at ${merchant.name}`}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {merchant.totalVotes} votes
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm"
                        >
                          View codes
                        </Button>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No merchants found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
