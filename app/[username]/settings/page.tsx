"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile-header";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export default function UserSettingsPage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <ProfileHeader
        username={userProfile.username}
        avatarUrl={userProfile.avatarUrl}
        registeredAt={new Date(userProfile.createdAt)}
      />

      <div className="max-w-[82.5rem] mx-auto px-4 py-8">
        <div className="bg-white dark:bg-[#1d1f20] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Settings Page
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Settings content will go here...
          </p>
        </div>
      </div>
    </div>
  );
}
