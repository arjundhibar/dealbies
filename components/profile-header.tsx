"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Dot, MessageSquare, Tag } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileHeaderProps {
  username: string;
  avatarUrl?: string;
  registeredAt: Date;
}

export function ProfileHeader({
  username,
  avatarUrl,
  registeredAt,
}: ProfileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("points-club");
  const [offersCount, setOffersCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch actual counts when component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching counts for username:", username);

        // Fetch offers count
        const offersResponse = await fetch(
          `/api/users/offers-count?username=${username}`
        );
        console.log("📦 Offers API response status:", offersResponse.status);

        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          console.log("📦 Offers API data:", offersData);
          setOffersCount(offersData.count || 0);
        } else {
          console.log("❌ Offers API failed:", offersResponse.statusText);
        }

        // Fetch comments count
        const commentsResponse = await fetch(
          `/api/users/comments-count?username=${username}`
        );
        console.log(
          "💬 Comments API response status:",
          commentsResponse.status
        );

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          console.log("💬 Comments API data:", commentsData);
          setCommentsCount(commentsData.count || 0);
        } else {
          console.log("❌ Comments API failed:", commentsResponse.statusText);
        }
      } catch (error) {
        console.error("❌ Error fetching counts:", error);
        // Set to 0 if API fails
        setOffersCount(0);
        setCommentsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [username]);

  // Determine active tab based on current route
  useEffect(() => {
    if (pathname.includes("/points-and-rewards")) {
      setActiveTab("points-club");
    } else if (pathname.includes("/dealalerts-feed")) {
      setActiveTab("dealalerts-feed");
    } else if (pathname.includes("/saved-deals")) {
      setActiveTab("favourites");
    } else if (pathname.includes("/activity")) {
      setActiveTab("activity");
    } else if (pathname.includes("/offers")) {
      setActiveTab("offers");
    } else if (pathname.includes("/referral-codes")) {
      setActiveTab("referral-codes");
    } else if (pathname.includes("/discussions")) {
      setActiveTab("discussion");
    } else if (pathname.includes("/badges")) {
      setActiveTab("badges");
    } else if (pathname.includes("/statistics")) {
      setActiveTab("statistics");
    } else if (pathname.includes("/settings")) {
      setActiveTab("settings");
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Navigate to the corresponding page
    switch (value) {
      case "points-club":
        router.push(`/${username}/points-and-rewards`);
        break;
      case "dealalerts-feed":
        router.push(`/${username}/dealalerts-feed`);
        break;
      case "favourites":
        router.push(`/${username}/saved-deals`);
        break;
      case "activity":
        router.push(`/${username}/activity`);
        break;
      case "offers":
        router.push(`/${username}/offers`);
        break;
      case "referral-codes":
        router.push(`/${username}/referral-codes`);
        break;
      case "discussion":
        router.push(`/${username}/discussions`);
        break;
      case "badges":
        router.push(`/${username}/badges`);
        break;
      case "statistics":
        router.push(`/${username}/statistics`);
        break;
      case "settings":
        router.push(`/${username}/settings`);
        break;
    }
  };

  // Format registration date to show exact month and date
  const formatRegistrationDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="w-screen -mt-[71px] sm:-mt-4 sm:-ml-28 sm:pt-8 bg-white dark:bg-[#1d1f20] border-b border-gray-200 dark:border-gray-800">
      <div className="w-screen sm:w-[1000px] mx-auto px-4 py-6">
        {/* Desktop Layout - Keep your original design */}
        {!isMobile && (
          <Card className="border-0 mt-8 sm:mt-2  rounded-2xl shadow-none bg-[rgba(15,55,95,0.05)] dark:bg-[hsla(0,0%,100%,0.11)] relative">
            <CardContent className="p-0">
              <div className="flex flex-col justify-center items-center gap-6 pt-10">
                {/* Avatar - Half outside, half inside the card */}
                <div className="relative -mt-20 z-10">
                  <Avatar className="h-24 w-24 shadow-lg">
                    <AvatarImage
                      src={avatarUrl || ""}
                      alt={username}
                      className="h-24 w-24 object-cover"
                    />
                    <AvatarFallback className="h-20 w-20 text-2xl font-poppins bg-gray-200 dark:bg-gray-700">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-2xl font-poppins text-gray-900 dark:text-white mb-2">
                    {username}
                  </h1>

                  <div className="flex flex-col items-center gap-4 text-sm text-black dark:text-white">
                    {/* Registration Date */}
                    <div className="flex items-center gap-2">
                      <span>
                        Registered {formatRegistrationDate(registeredAt)}
                      </span>
                    </div>

                    {/* Offers Count */}
                    <div className="flex items-center gap-1 mb-4">
                      <span>{loading ? "..." : `${offersCount} offers`}</span>
                      <Dot className="h-5 w-5" />
                      <span>
                        {loading ? "..." : `${commentsCount} comments`}
                      </span>
                    </div>

                    {/* Comments Count */}
                    <div className="flex items-center gap-2"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Layout - Separate design for mobile */}
        {isMobile && (
          <Card className="border-0 rounded-2xl shadow-none bg-[rgba(15,55,95,0.05)] dark:bg-[hsla(0,0%,100%,0.11)] mx-4">
            <CardContent className="p-0">
              <div className="flex flex-col justify-center items-center gap-4 pt-6">
                {/* Avatar - Smaller for mobile */}
                <div className="relative -mt-12 z-10">
                  <Avatar className="h-16 w-16 shadow-lg">
                    <AvatarImage
                      src={avatarUrl || ""}
                      alt={username}
                      className="h-16 w-16 object-cover"
                    />
                    <AvatarFallback className="h-16 w-16 text-lg font-poppins bg-gray-200 dark:bg-gray-700">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info - Mobile optimized */}
                <div className="flex flex-col justify-center items-center text-center px-4">
                  <h1 className="text-lg font-poppins text-gray-900 dark:text-white mb-2">
                    {username}
                  </h1>

                  <div className="flex flex-col items-center gap-3 text-xs text-black dark:text-white">
                    {/* Registration Date */}
                    <div className="flex items-center gap-2 text-center">
                      <span>
                        Registered {formatRegistrationDate(registeredAt)}
                      </span>
                    </div>

                    {/* Offers Count */}
                    <div className="flex items-center gap-1 mb-2">
                      <span>{loading ? "..." : `${offersCount} offers`}</span>
                      <Dot className="h-4 w-4" />
                      <span>
                        {loading ? "..." : `${commentsCount} comments`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desktop Navigation Tabs - Keep your original design */}
        {!isMobile && (
          <div className="flex justify-center mt-6 -mb-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="bg-transparent h-10 p-0">
                <TabsTrigger
                  value="points-club"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Points Club
                </TabsTrigger>
                <TabsTrigger
                  value="dealalerts-feed"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  DealAlerts Feed
                </TabsTrigger>
                <TabsTrigger
                  value="favourites"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Favourites
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="offers"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Offers
                </TabsTrigger>
                <TabsTrigger
                  value="referral-codes"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Referral Codes
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="badges"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Badges
                </TabsTrigger>
                <TabsTrigger
                  value="statistics"
                  className="rounded-none h-10 px-4 data-[state=active]:border-b-2 data-[state=active]:border-dealhunter-red data-[state=active]:shadow-none data-[state=active]:text-dealhunter-red hover:text-dealhunter-red"
                >
                  Statistics
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Mobile Navigation Tabs - Horizontal scrolling for mobile */}
        {isMobile && (
          <div className="mt-6 -mb-6 px-4">
            <div className="overflow-x-auto">
              <div className="flex gap-0 min-w-max">
                <button
                  onClick={() => handleTabChange("points-club")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "points-club"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Points Club
                </button>
                <button
                  onClick={() => handleTabChange("dealalerts-feed")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "dealalerts-feed"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  DealAlerts Feed
                </button>
                <button
                  onClick={() => handleTabChange("favourites")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "favourites"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Favourites
                </button>
                <button
                  onClick={() => handleTabChange("activity")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "activity"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => handleTabChange("offers")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "offers"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Offers
                </button>
                <button
                  onClick={() => handleTabChange("referral-codes")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "referral-codes"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Referral Codes
                </button>
                <button
                  onClick={() => handleTabChange("discussion")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "discussion"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Discussion
                </button>
                <button
                  onClick={() => handleTabChange("badges")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "badges"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Badges
                </button>
                <button
                  onClick={() => handleTabChange("statistics")}
                  className={`h-10 px-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === "statistics"
                      ? "border-dealhunter-red text-dealhunter-red"
                      : "border-transparent text-gray-600 hover:text-dealhunter-red"
                  }`}
                >
                  Statistics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
