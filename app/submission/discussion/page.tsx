"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmissionEditor } from "@/components/submission-editor";
import { cn } from "@/lib/utils";
import { Info, Check, Plus, CheckCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function PostDiscussionPage() {
  const { session, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [titleFocused, setTitleFocused] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDealCategories, setSelectedDealCategories] = useState<
    string[]
  >([]);
  const [categoryError, setCategoryError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Other",
    "Introduce yourself",
    "Shop info & experiences",
    "Ask",
    "Ordering from abroad",
    "Save money: Tips & tricks",
    "Contests",
  ];

  const dealCategories = [
    "Electronics",
    "Gaming",
    "Groceries",
    "Fashion & Accessories",
    "Beauty & Health",
    "To Travel",
    "Family & Children",
    "Home & Living",
    "Garden & DIY",
    "Cars & Motorcycle",
    "Culture & Leisure",
    "Sports & Outdoors",
    "Telecom & Internet",
    "Money Matters & Insurance",
    "Services & Contracts",
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleDealCategory = (category: string) => {
    setSelectedDealCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Hide categories when any are selected
  const shouldShowCategories =
    selectedCategories.length === 0 && selectedDealCategories.length === 0;

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Please log in to post a discussion
        </h1>
        <p className="text-gray-600">
          You need to be logged in to create discussions.
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setTitleError("");
      setCategoryError("");

      // Validation
      if (!title.trim()) {
        setTitleError("Title is required");
        return;
      }
      if (!description.trim()) {
        setCategoryError("Description is required");
        return;
      }
      if (
        selectedCategories.length === 0 &&
        selectedDealCategories.length === 0
      ) {
        setCategoryError("Please select at least one category");
        return;
      }

      // Prepare data
      const discussionData = {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategories[0] || "", // Use first selected category
        dealCategory: selectedDealCategories[0] || null, // Use first selected deal category
      };

      // Check if user is authenticated
      if (!session?.access_token) {
        setCategoryError("You must be logged in to post a discussion");
        return;
      }

      // Submit to API
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(discussionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to post discussion");
      }

      const result = await response.json();
      console.log("Discussion posted successfully:", result);

      // Redirect to the discussion page or show success message
      // You can add navigation here
      alert("Discussion posted successfully!");
    } catch (error) {
      console.error("Error posting discussion:", error);
      setCategoryError(
        error instanceof Error ? error.message : "Failed to post discussion"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center bg-white justify-center -my-4 -mx-28 animate-fade-in-up min-h-screen w-screen"
      style={{ animationDelay: "0.1s", animationFillMode: "both" }}
    >
      <div className="w-full space-y-6 mt-10">
        <div className="space-y-6">
          <h1 className="text-[32px] leading-[2.625rem]  font-semibold text-[#000] dark:text-[#fff] ml-[450px]">
            Post a discussion
          </h1>
        </div>
      </div>

      <div className="w-full max-w-3xl px-8 py-8">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <label className="dark:text-white text-black text-sm font-semibold pb-[1.75px]">
                Title{" "}
              </label>
              <span className="dark:text-[hsla(0,0%,100%,0.75)] text-sm">
                {140 - title.length}
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A clear, engaging title for your discussion"
              className={`w-full border rounded-lg pt-2 pb-2 pl-4 pr-4 focus:ring-0 placeholder:text-gray-400 ${
                titleError
                  ? "border-red-500 focus:border-red-500"
                  : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] focus:border-[#f97936] dark:focus:border-[#f97936]"
              } dark:bg-[#1d1f20] dark:text-white`}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
            />
            {titleError && (
              <div className="text-red-500 text-xs mt-1">{titleError}</div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold dark:text-white text-black pb-[1.75px]">
              Description
            </h2>
            <div className="space-y-1 w-full">
              <SubmissionEditor
                content={description}
                onUpdate={(content) => setDescription(content)}
                placeholder="Share your thoughts, ask questions, or start a conversation about deals, shopping tips, or anything related to saving money..."
                className="w-full"
                minHeight="200px"
              />
            </div>
          </div>

          {/* Category Section */}
          <div className="border-b pb-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-[12.25px] font-bold text-[#000] dark:text-[#fff]">
                  Category{" "}
                </h2>
                <p className="text-sm text-[rgba(4,8,13,0.59)] dark:text-gray-400">
                  What is your discussion about?
                </p>
              </div>

              {/* Category Grid - Show only selected or all if none selected */}
              <div className="flex flex-wrap gap-2 mb-[7px]">
                {(selectedCategories.length > 0
                  ? selectedCategories
                  : categories
                ).map((category) => (
                  <Button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    variant="outline"
                    className={cn(
                      "h-9 w-fit px-[14px] text-sm font-bold text-left justify-start border border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] rounded-full transition-all duration-200",
                      selectedCategories.includes(category)
                        ? "bg-[#fbf3ef] border-[#f7641b] text-[#f7641b] hover:bg-[#fbece3] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                        : "bg-[#fff] border-[#dfe1e4] text-[#6b6d70] hover:border-[#d7d9dd] hover:text-[#76787b] hover:bg-[#f3f5f7] dark:bg-[#1d1f20] dark:border-[#46484b] dark:text-[#c5c7ca] dark:hover:border-[#525457] dark:hover:text-[#babcbf] dark:hover:bg-[#28292a]"
                    )}
                  >
                    {selectedCategories.includes(category) ? (
                      <Check className="h-4 w-4 flex-shrink-0 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-4 w-4 flex-shrink-0 stroke-[2.5]" />
                    )}
                    <span className="text-sm font-semibold">{category}</span>
                  </Button>
                ))}
              </div>
              {categoryError && (
                <div className="text-red-500 text-xs mt-1">{categoryError}</div>
              )}
            </div>
            <p className="text-sm mt-10 text-[rgba(4,8,13,0.59)] dark:text-gray-400 mb-4">
              Does your discussion fit into one of our deal categories?
            </p>
            <div className="flex flex-wrap gap-2 mb-[7px]">
              {(selectedDealCategories.length > 0
                ? selectedDealCategories
                : dealCategories
              ).map((category) => (
                <Button
                  key={category}
                  onClick={() => toggleDealCategory(category)}
                  variant="outline"
                  className={cn(
                    "h-9 w-fit px-[14px] text-sm font-bold text-left justify-start border border-[#dfe1e4] hover:border-[#d7d9dd] hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] rounded-full transition-all duration-200",
                    selectedDealCategories.includes(category)
                      ? "bg-[#fbf3ef] border-[#f7641b] text-[#f7641b] hover:bg-[#fbece3] hover:border-[#eb611f] hover:text-[#eb611f] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203]"
                      : "bg-[#fff] border-[#dfe1e4] text-[#6b6d70] hover:border-[#d7d9dd] hover:text-[#76787b] hover:bg-[#f3f5f7] dark:bg-[#1d1f20] dark:border-[#46484b] dark:text-[#c5c7ca] dark:hover:border-[#525457] dark:hover:text-[#babcbf] dark:hover:bg-[#28292a]"
                  )}
                >
                  {selectedDealCategories.includes(category) ? (
                    <Check className="h-4 w-4 flex-shrink-0 stroke-[2.5]" />
                  ) : (
                    <Plus className="h-4 w-4 flex-shrink-0 stroke-[2.5]" />
                  )}
                  <span className="text-sm font-semibold">{category}</span>
                </Button>
              ))}
            </div>
            {categoryError && (
              <div className="text-red-500 text-xs mt-1">{categoryError}</div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-white border border-red-600 text-red-800 px-4 py-2 rounded-full font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#f7641b] hover:bg-[#e55a17] text-white px-4 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Posting...
                </div>
              ) : (
                <>
                  <Check className="h-5 w-5" strokeWidth={3.5} />
                  Post Discussion
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
