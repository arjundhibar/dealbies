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
        const response = await fetch(`/api/users/${username}/profile`);
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

      <div className="w-[1000px] bg-white mt-2 rounded-xl mx-auto px-4 py-8">
        <div className="space-y-2">
          {/* Club Points Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">Club</h2>
              <p className="text-3xl font-bold text-black">0 points</p>
            </div>
          </div>

          {/* Unlock Message */}
          <div className="">
            <p className="text-[rgba(4,8,13,0.59)] font-medium">
              10 points to unlock silver rewards!
            </p>
          </div>

          {/* Milestone Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Silver 10 points</span>
              <span>Gold 30 points</span>
              <span>Platinum 3000 pts</span>
            </div>

            <div className="relative">
              {/* Progress Bar Background */}
              <div className="w-full h-3 bg-gray-200 rounded-full">
                {/* Progress Fill - Orange color based on current points */}
                <div
                  className="h-3 bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((0 / 3000) * 100, 100)}%` }}
                ></div>
              </div>

              {/* Milestone Dots */}
              <div className="absolute top-0 left-0 w-full h-3 flex justify-between items-center">
                {/* Silver milestone (10 points) */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    0 >= 10 ? "bg-orange-500" : "bg-gray-300"
                  }`}
                ></div>

                {/* Gold milestone (30 points) */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    0 >= 30 ? "bg-orange-500" : "bg-gray-300"
                  }`}
                ></div>

                {/* Platinum milestone (3000 points) */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    0 >= 3000 ? "bg-orange-500" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
