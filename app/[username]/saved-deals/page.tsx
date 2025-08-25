"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Clock, Tag, Heart } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

interface SavedDeal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  savedAt: string;
  deal: {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    coverImage?: {
      slug: string;
    };
  };
}

export default function SavedDealsPage() {
  const params = useParams();
  const username = params.username as string;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
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

  useEffect(() => {
    const fetchSavedDeals = async () => {
      if (!userProfile) return;

      try {
        const response = await fetch(`/api/users/saved-deals`);
        if (response.ok) {
          const data = await response.json();
          setSavedDeals(data);
        }
      } catch (error) {
        console.error("Error fetching saved deals:", error);
      }
    };

    fetchSavedDeals();
  }, [userProfile]);

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
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="h-6 w-6 text-dealhunter-red" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Saved Deals
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({savedDeals.length} deals)
          </span>
        </div>

        {savedDeals.length === 0 ? (
          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardContent className="p-12 text-center">
              <Bookmark className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No saved deals yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start saving deals you like to view them later
              </p>
              <button className="px-4 py-2 bg-dealhunter-red text-white rounded-lg hover:bg-red-700 transition-colors">
                Browse Deals
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDeals.map((savedDeal) => (
              <Card
                key={savedDeal.id}
                className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {savedDeal.deal.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          Saved{" "}
                          {new Date(savedDeal.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="text-dealhunter-red hover:text-red-700 transition-colors">
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-lg font-bold text-dealhunter-red">
                        ${savedDeal.deal.price}
                      </span>
                      {savedDeal.deal.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${savedDeal.deal.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {savedDeal.deal.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <button className="text-sm text-dealhunter-red hover:text-red-700 font-medium transition-colors">
                        View Deal
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
