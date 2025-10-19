"use client";

import { getSeoAttributes } from "@/lib/affiliate-utils";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, Percent, Truck, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface StoreCoupon {
  id: string;
  slug: string;
  title: string;
  description: string;
  discountCode: string;
  discountType: string;
  discountValue?: string;
  discountDisplay: string;
  imageUrl: string;
  couponUrl: string;
  merchant: string;
  category: string;
  expiresAt?: string;
  createdAt: string;
  score: number;
  commentCount: number;
  postedBy: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface StoreData {
  coupons: StoreCoupon[];
  counts: {
    all: number;
    discountCodes: number;
    deals: number;
    freeShipping: number;
    checked: number;
  };
  storeName: string;
}

export default function StorePage() {
  const params = useParams();
  const storeName = params.store as string;
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetStoreCoupons($merchant: String) {
                coupons(merchant: $merchant) {
                  id
                  slug
                  title
                  description
                  imageUrls {
                    url
                    slug
                  }
                  discountCode
                  discountType
                  discountValue
                  merchant
                  availability
                  couponUrl
                  expired
                  expiresAt
                  startAt
                  category
                  createdAt
                  score
                  commentCount
                  postedBy {
                    id
                    username
                    avatarUrl
                  }
                  userVote
                }
              }
            `,
            variables: { merchant: storeName },
          }),
        });

        const { data } = await response.json();
        if (data?.coupons) {
          // Filter coupons based on active filter
          let filteredCoupons = data.coupons;

          if (activeFilter === "discount-codes") {
            filteredCoupons = data.coupons.filter(
              (coupon: any) =>
                coupon.discountType === "percentage" ||
                coupon.discountType === "euro"
            );
          } else if (activeFilter === "deals") {
            filteredCoupons = data.coupons.filter(
              (coupon: any) => coupon.discountType === "none"
            );
          } else if (activeFilter === "free-shipping") {
            filteredCoupons = data.coupons.filter(
              (coupon: any) => coupon.discountType === "freeShipping"
            );
          } else if (activeFilter === "checked") {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            filteredCoupons = data.coupons.filter(
              (coupon: any) => new Date(coupon.createdAt) >= sevenDaysAgo
            );
          }

          // Format coupons
          const formattedCoupons = filteredCoupons.map((coupon: any) => {
            // Format discount value based on type
            let discountDisplay = "";
            if (coupon.discountType === "percentage") {
              discountDisplay = `${coupon.discountValue}% DISCOUNT`;
            } else if (coupon.discountType === "euro") {
              discountDisplay = `€${coupon.discountValue} DISCOUNT`;
            } else if (coupon.discountType === "freeShipping") {
              discountDisplay = "FREE SHIPPING";
            } else {
              discountDisplay = "DEAL";
            }

            return {
              id: coupon.id,
              slug: coupon.slug,
              title: coupon.title,
              description: coupon.description,
              discountCode: coupon.discountCode,
              discountType: coupon.discountType,
              discountValue: coupon.discountValue?.toString(),
              discountDisplay,
              imageUrl:
                coupon.imageUrls?.[0]?.url ||
                "/placeholder.svg?height=64&width=64&query=coupon",
              couponUrl: coupon.couponUrl,
              merchant: coupon.merchant,
              category: coupon.category,
              expiresAt: coupon.expiresAt,
              createdAt: coupon.createdAt,
              score: coupon.score,
              commentCount: coupon.commentCount,
              postedBy: {
                id: coupon.postedBy.id,
                username: coupon.postedBy.username,
                avatarUrl: coupon.postedBy.avatarUrl,
              },
            };
          });

          // Calculate counts for all filters
          const allCount = data.coupons.length;
          const discountCodesCount = data.coupons.filter(
            (coupon: any) =>
              coupon.discountType === "percentage" ||
              coupon.discountType === "euro"
          ).length;
          const dealsCount = data.coupons.filter(
            (coupon: any) => coupon.discountType === "none"
          ).length;
          const freeShippingCount = data.coupons.filter(
            (coupon: any) => coupon.discountType === "freeShipping"
          ).length;
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const checkedCount = data.coupons.filter(
            (coupon: any) => new Date(coupon.createdAt) >= sevenDaysAgo
          ).length;

          setStoreData({
            coupons: formattedCoupons,
            counts: {
              all: allCount,
              discountCodes: discountCodesCount,
              deals: dealsCount,
              freeShipping: freeShippingCount,
              checked: checkedCount,
            },
            storeName,
          });
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeName, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="max-w-[82.5rem] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"
                ></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="max-w-[82.5rem] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Store not found
          </h1>
        </div>
      </div>
    );
  }

  const filters = [
    { key: "all", label: `ALL (${storeData.counts.all})`, icon: null },
    {
      key: "discount-codes",
      label: `DISCOUNT CODES (${storeData.counts.discountCodes})`,
      icon: <Percent className="h-4 w-4" />,
    },
    {
      key: "deals",
      label: `DEALS (${storeData.counts.deals})`,
      icon: <ExternalLink className="h-4 w-4" />,
    },
    {
      key: "free-shipping",
      label: `FREE SHIPPING (${storeData.counts.freeShipping})`,
      icon: <Truck className="h-4 w-4" />,
    },
    {
      key: "checked",
      label: `CHECKED (${storeData.counts.checked})`,
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <div className="max-w-[82.5rem] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Information Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  We may earn a commission when you buy through our links.
                </p>
              </div>
            </div>

            {/* Store Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Current {storeData.storeName} discount codes in 2025
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose from {storeData.counts.all} Pepper-verified{" "}
                    {storeData.storeName} discounts and deals
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">
                      {storeData.storeName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? "default" : "outline"}
                  className={`flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.icon}
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Coupons List */}
            <div className="space-y-4">
              {storeData.coupons.map((coupon) => (
                <Card
                  key={coupon.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-orange-500">
                          {coupon.discountDisplay}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge variant="secondary" className="text-xs">
                              {coupon.discountType === "percentage" ||
                              coupon.discountType === "euro"
                                ? "Discount code"
                                : "Discount"}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                            {coupon.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {coupon.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/coupon/${coupon.slug}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          More details
                        </Link>
                        {coupon.expiresAt && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Valid until:{" "}
                            {new Date(coupon.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Button
                        asChild
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Link
                          href={`/visit/${coupon.slug}`}
                          {...getSeoAttributes(coupon.merchant || "")}
                        >
                          {coupon.discountType === "percentage" ||
                          coupon.discountType === "euro"
                            ? "View code >"
                            : "To the deal >"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {storeData.coupons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No coupons found for {storeData.storeName} with the selected
                  filter.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Rating Section */}
              <Card className="bg-white dark:bg-gray-800 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  How do you rate our {storeData.storeName} codes?
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= 3.5
                          ? "text-orange-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  votes with an average of stars.
                </p>
              </Card>

              {/* Savings Opportunities */}
              <Card className="bg-white dark:bg-gray-800 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Savings opportunities
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-orange-500" />
                    This {storeData.storeName} discount code was very popular
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-orange-500" />
                    The best saving tips for {storeData.storeName}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-orange-500" />
                    Frequently Asked Questions about {storeData.storeName}
                  </li>
                </ul>
              </Card>

              {/* Excitement Section */}
              <Card className="bg-white dark:bg-gray-800 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Why we're so excited about {storeData.storeName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  At DealHunter, we celebrate finding smart deals and shared
                  savings. That's why our community is so enthusiastic about
                  shopping at {storeData.storeName}, because here you'll
                  discover more than just great products; it's a place where
                  every purchase becomes an opportunity to save and share the
                  excitement of finding the perfect deal.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
