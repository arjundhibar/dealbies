"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, ThumbsUp, User } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  comments: number;
  category?: string;
  dealCategory?: string;
  postedBy?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export default function DiscussionsPage() {
  const params = useParams();
  const username = params.username as string;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [discussionsLoading, setDiscussionsLoading] = useState(false);

  console.log("DiscussionsPage rendered for username:", username);

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

  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!userProfile) return;

      setDiscussionsLoading(true);
      try {
        console.log("Fetching discussions for username:", username);
        const apiUrl = `/api/users/${username}/discussions`;
        console.log("API URL:", apiUrl);
        const response = await fetch(apiUrl);
        console.log("Response status:", response.status);
        console.log("Response URL:", response.url);

        if (response.ok) {
          const data = await response.json();
          console.log("Discussions data received:", data);
          setDiscussions(data);
        } else {
          const errorText = await response.text();
          console.error(
            "Failed to fetch discussions:",
            response.statusText,
            errorText
          );
          setDiscussions([]);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setDiscussions([]);
      } finally {
        setDiscussionsLoading(false);
      }
    };

    fetchDiscussions();
  }, [userProfile, username]);

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
          <MessageSquare className="h-6 w-6 text-dealhunter-red" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discussions
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({discussions.length} discussions)
          </span>
        </div>

        {discussionsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800"
              >
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <Card className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No discussions yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start a discussion to engage with the community
              </p>
              <button className="px-4 py-2 bg-dealhunter-red text-white rounded-lg hover:bg-red-700 transition-colors">
                Start Discussion
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="bg-white dark:bg-[#1d1f20] border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {discussion.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {discussion.content}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{discussion.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{discussion.comments}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="text-sm text-dealhunter-red hover:text-red-700 font-medium transition-colors">
                        View Discussion
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        Edit
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
