"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export default function UserSettingsPage() {
  const params = useParams();
  const username = params.username as string;
  const { session } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "preferences"
    | "social"
    | "notifications"
    | "subscriptions"
    | "follows"
  >("profile");

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: "",
    description: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Input handlers
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload-images", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Upload response:", data);

            // Use the URL directly from your API response
            let avatarUrl =
              data.url || data.result?.url || data.result?.variants?.[0];

            console.log("Avatar URL from API:", avatarUrl);

            if (avatarUrl) {
              // Update the user profile with new avatar URL
              setUserProfile((prev) =>
                prev ? { ...prev, avatarUrl: avatarUrl } : null
              );

              // Save to database with the new avatar URL directly
              await handleSaveProfileWithAvatar(avatarUrl);
            } else {
              console.error("No valid URL found in response:", data);
              alert("No avatar URL received from server");
            }
          } else {
            const errorText = await response.text();
            console.error("Upload failed:", response.status, errorText);
            alert("Failed to upload avatar. Please try again.");
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          alert("Error uploading avatar. Please try again.");
        }
      }
    };
    input.click();
  };

  const handleAvatarRemove = async () => {
    try {
      // Update the user profile to remove avatar
      setUserProfile((prev) => (prev ? { ...prev, avatarUrl: null } : null));
      console.log("Avatar removed successfully");
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!session?.access_token) {
        console.error("No session found");
        return;
      }

      const requestData = {
        username: profileData.username,
        email: profileData.email,
        avatarUrl: userProfile?.avatarUrl,
        password: profileData.password || undefined,
      };

      console.log("Saving profile with data:", requestData);

      const response = await fetch(`/api/users/${username}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Profile save response status:", response.status);

      if (response.ok) {
        const updatedProfile = await response.json();
        console.log("Updated profile from server:", updatedProfile);
        setUserProfile(updatedProfile);
        console.log("Profile saved successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to save profile:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleSaveProfileWithAvatar = async (avatarUrl: string) => {
    try {
      if (!session?.access_token) {
        console.error("No session found");
        return;
      }

      const requestData = {
        username: profileData.username,
        email: profileData.email,
        avatarUrl: avatarUrl,
        password: profileData.password || undefined,
      };

      console.log("Saving profile with avatar URL:", requestData);

      const response = await fetch(`/api/users/${username}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Profile save response status:", response.status);

      if (response.ok) {
        const updatedProfile = await response.json();
        console.log("Updated profile from server:", updatedProfile);
        setUserProfile(updatedProfile);
        console.log("Profile saved successfully with avatar");
      } else {
        const errorText = await response.text();
        console.error("Failed to save profile:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Delete account clicked");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/${username}/profile`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          // Populate form data
          setProfileData({
            username: data.username || "",
            description: data.description || "",
            email: data.email || "",
            password: "",
            confirmPassword: "",
          });
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
      <div className="max-w-[82.5rem] mx-auto px-4 py-8">
        <div className="bg-white dark:bg-[#1d1f20] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex">
            {/* Left Sidebar - Vertical Tabs */}
            <div className="w-80 bg-gray-50 dark:bg-[#28292a] border-r border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Institutions
                </h1>

                <nav className="space-y-2">
                  {/* Profile Tab */}
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Profile</span>
                  </button>

                  {/* Preferences Tab */}
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "preferences"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("preferences")}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                    </svg>
                    <span>Preferences</span>
                  </button>

                  {/* Social Connect Tab */}
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "social"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("social")}
                  >
                    <svg
                      width="20"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16,6 12,2 8,6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span>Social Connect</span>
                  </button>

                  {/* Notifications Tab */}
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    <span>Notifications</span>
                  </button>

                  {/* Subscriptions Tab */}
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "subscriptions"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("subscriptions")}
                  >
                    <svg
                      width="22"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Subscriptions</span>
                  </button>

                  {/* Following / Ignored Tab */}
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "follows"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab("follows")}
                  >
                    <svg
                      width="24"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Following / Ignored</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Right Side - Tab Content */}
            <div className="flex-1 p-8">
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile
                  </h2>

                  <div className="space-y-6">
                    {/* Your avatar */}
                    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Your avatar
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Optional
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              userProfile?.avatarUrl || "/placeholder-user.jpg"
                            }
                            alt="Profile Avatar"
                            className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {userProfile?.avatarUrl
                                ? "Avatar uploaded"
                                : "No avatar set"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              For best results, upload a square image
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleAvatarUpload}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    {/* Your username */}
                    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Your username
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Your username can only be changed once every 6
                            months.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {profileData.username || "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const newUsername = prompt(
                              "Enter new username:",
                              profileData.username
                            );
                            if (
                              newUsername &&
                              newUsername !== profileData.username
                            ) {
                              handleInputChange("username", newUsername);
                            }
                          }}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Change Username
                        </button>
                      </div>
                    </div>

                    {/* Your description */}
                    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Your description
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Tell us about yourself
                          </p>
                        </div>
                        <div className="text-right max-w-md">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {profileData.description || "No description set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const newDescription = prompt(
                              "Enter description:",
                              profileData.description
                            );
                            if (newDescription !== null) {
                              handleInputChange("description", newDescription);
                            }
                          }}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Change Description
                        </button>
                      </div>
                    </div>

                    {/* Your email */}
                    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Your email
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Your account email address
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {profileData.email || "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const newEmail = prompt(
                              "Enter new email:",
                              profileData.email
                            );
                            if (newEmail && newEmail !== profileData.email) {
                              handleInputChange("email", newEmail);
                            }
                          }}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Change Email
                        </button>
                      </div>
                    </div>

                    {/* Choose a password */}
                    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Choose a password
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Because you're registered with a social-connect
                            account, you don't have a password. Set one here.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {profileData.password
                              ? "••••••••"
                              : "No password set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const newPassword = prompt("Enter new password:");
                            if (newPassword) {
                              handleInputChange("password", newPassword);
                            }
                          }}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Account data */}
                    <div className="py-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Account data
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Permanently delete your account
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Account active
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 text-sm border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Preferences
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize your application preferences and settings.
                  </p>
                  <div className="bg-gray-50 dark:bg-[#28292a] rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      Preferences content will go here...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Social Connect
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect your social media accounts and manage sharing
                    preferences.
                  </p>
                  <div className="bg-gray-50 dark:bg-[#28292a] rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      Social connect content will go here...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configure how and when you receive notifications.
                  </p>
                  <div className="bg-gray-50 dark:bg-[#28292a] rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      Notifications content will go here...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "subscriptions" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Subscriptions
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your email subscriptions and newsletter preferences.
                  </p>
                  <div className="bg-gray-50 dark:bg-[#28292a] rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      Subscriptions content will go here...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "follows" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Following / Ignored
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage users you follow and content you want to ignore.
                  </p>
                  <div className="bg-gray-50 dark:bg-[#28292a] rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      Following/Ignored content will go here...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
