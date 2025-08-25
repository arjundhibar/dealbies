"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Gift, Star, TrendingUp } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export default function PointsAndRewardsPage() {
  const params = useParams();
  const username = params.username as string;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/profile?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="max-w-[82.5rem] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="max-w-[82.5rem] mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProfileHeader
        username={userProfile.username}
        avatarUrl={userProfile.avatarUrl}
        registeredAt={new Date(userProfile.createdAt)}
      />

      <div className="w-[1000px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                1,250
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +150 this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-500" />
                Rewards Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                8
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                3 available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-500" />
                Current Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Gold
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Next: Platinum
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Monthly Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                #42
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Top 10%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Deal posted
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +50 points
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2h ago
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Comment added
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +10 points
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    1d ago
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Daily login
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +5 points
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2d ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Available Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Free Shipping
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Valid for 30 days
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-dealhunter-red text-white text-xs rounded-full hover:bg-red-700 transition-colors">
                    Claim
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      20% Off Coupon
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Valid for 7 days
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-dealhunter-red text-white text-xs rounded-full hover:bg-red-700 transition-colors">
                    Claim
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Premium Badge
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Valid for 90 days
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-dealhunter-red text-white text-xs rounded-full hover:bg-red-700 transition-colors">
                    Claim
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
