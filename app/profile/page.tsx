"use client";

import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Bookmark,
  Activity,
  Tag,
  Megaphone,
  MessageSquare,
  Star,
  ChartNoAxesColumn,
  Settings,
  Flame,
  CheckCircle,
  ArrowUpDown,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("points-club");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.email) {
        try {
          const response = await fetch(
            `/api/users/profile?email=${encodeURIComponent(user.email)}`
          );
          if (response.ok) {
            const profile = await response.json();
            setUserProfile(profile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const tabs = [
    {
      id: "points-club",
      name: "Points club",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      id: "dealalerts",
      name: "DealAlerts feed",
      icon: <Bookmark className="h-4 w-4" />,
    },
    {
      id: "favorites",
      name: "Favorites",
      icon: <Bookmark className="h-4 w-4" />,
    },
    {
      id: "activity",
      name: "Activity",
      icon: <Activity className="h-4 w-4" />,
    },
    { id: "offers", name: "Offers", icon: <Tag className="h-4 w-4" /> },
    {
      id: "referral-codes",
      name: "Referral codes",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      id: "discussion",
      name: "Discussion",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    { id: "badges", name: "Badges", icon: <Star className="h-4 w-4" /> },
    {
      id: "statistics",
      name: "Statistics",
      icon: <ChartNoAxesColumn className="h-4 w-4" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "points-club":
        return (
          <div className="space-y-6">
            {/* Points Club Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">Club</h2>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {userProfile?.points || 0} points
                  </div>
                  <p className="text-orange-600 font-medium">
                    10 points to unlock Silver rewards!
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Silver</span>
                    <span>Gold</span>
                    <span>Platinum</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            ((userProfile?.points || 0) / 10) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">10 pts</span>
                      <span className="text-xs text-gray-500">30 pts</span>
                      <span className="text-xs text-gray-500">300 pts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Points Distribution */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Points distribution (Last 12 months)
                </h3>

                <div className="space-y-4">
                  {/* Hot Deals */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Hot deals</p>
                        <p className="text-sm text-gray-600">
                          10 points if others vote your deal to 100 degrees
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {userProfile?.hotDealsPoints || 0} points
                    </Badge>
                  </div>

                  {/* Helpful Comments */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Helpful comments</p>
                        <p className="text-sm text-gray-600">
                          10 points if your comment gets 3 'useful' votes
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {userProfile?.commentPoints || 0} points
                    </Badge>
                  </div>

                  {/* Weekly Votes */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ArrowUpDown className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Weekly votes</p>
                        <p className="text-sm text-gray-600">
                          1 point for every 3 votes per week
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Current week: August 25 - August 31
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 mb-1"
                      >
                        {userProfile?.weeklyVotePoints || 0} points
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>1 pt</span>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "favorites":
        return (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500">
              Start saving deals you love to see them here
            </p>
          </div>
        );

      case "activity":
        return (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-500">
              Your activity will appear here once you start using the platform
            </p>
          </div>
        );

      case "offers":
        return (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No offers posted yet
            </h3>
            <p className="text-gray-500">
              Start posting deals to see them here
            </p>
          </div>
        );

      case "referral-codes":
        return (
          <div className="text-center py-12">
            <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No referral codes posted yet
            </h3>
            <p className="text-gray-500">
              Share referral codes to help others save money
            </p>
          </div>
        );

      case "discussion":
        return (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No discussions started yet
            </h3>
            <p className="text-gray-500">
              Start discussions to engage with the community
            </p>
          </div>
        );

      case "badges":
        return (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No badges earned yet
            </h3>
            <p className="text-gray-500">
              Complete actions to earn badges and rewards
            </p>
          </div>
        );

      case "statistics":
        return (
          <div className="text-center py-12">
            <ChartNoAxesColumn className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Statistics coming soon
            </h3>
            <p className="text-gray-500">
              Track your performance and engagement metrics
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your profile
          </h1>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <div className="mb-6">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage
                src={userProfile?.avatarUrl || user.user_metadata?.avatar || ""}
                alt={
                  userProfile?.username ||
                  user.user_metadata?.username ||
                  user.email
                }
                className="h-24 w-24 object-cover"
              />
              <AvatarFallback className="h-24 w-24 text-2xl">
                {(
                  userProfile?.username ||
                  user.user_metadata?.username ||
                  user.email?.split("@")[0]
                )
                  ?.charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {userProfile?.username ||
                user.user_metadata?.username ||
                user.email?.split("@")[0]}
            </h1>

            <p className="text-gray-600 mb-4">
              Registered{" "}
              {userProfile?.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Recently"}
            </p>

            <div className="flex items-center justify-center gap-6 text-gray-600">
              <span>{userProfile?.dealsPosted || 0} offers</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{userProfile?.commentsPosted || 0} comments</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-500 font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
