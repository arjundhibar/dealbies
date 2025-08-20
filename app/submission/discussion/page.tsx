"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TipTapEditor } from "@/components/tiptap-editor";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export default function PostDiscussionPage() {
  const [title, setTitle] = useState("");
  const [titleFocused, setTitleFocused] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log("Submitting discussion:", { title, description });
  };

  return (
    <div className="min-h-screen w-screen fixed inset-0 bg-white dark:bg-[#1d1f20] flex items-center justify-center overflow-hidden">
      <div className="bg-[#f3f5f7] dark:bg-[#28292a] ">
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-[#000] dark:text-[#fff]">
            Post a discussion
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center">
              <label className="dark:text-white text-black text-sm font-semibold pb-[1.75px]">
                Title{" "}
                <span className="dark:text-[hsla(0,0%,100%,0.75)] font-normal">
                  (required)
                </span>
              </label>
              <span className="dark:text-[hsla(0,0%,100%,0.75)] text-sm">
                {140 - title.length}
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A clear, engaging title for your discussion"
              className="w-full border border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)] dark:bg-[#1d1f20] dark:text-white dark:focus:ring-0 placeholder:text-gray-400 rounded-lg pt-2 pb-2 pl-4 pr-4 dark:focus:border-[#f97936]"
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
            />
            <div
              className={cn(
                "transition-[height] duration-300 ease-in-out overflow-hidden",
                !titleFocused && "expand-leave-to"
              )}
              style={{ height: titleFocused ? 110 : 0 }}
            >
              <div className="mt-2 bg-[#f3f5f7] dark:bg-[#363739] rounded-lg px-4 py-3 flex flex-col gap-1">
                <div className="flex items-center">
                  <Info className="w-[18px] h-[18px] dark:text-[hsla(0,0%,100%,0.75)] text-black" />
                  <span className="font-semibold text-base text-black dark:text-[#e3e4e8]">
                    Make your title engaging
                  </span>
                </div>
                <div className="text-sm leading-5 dark:text-[hsla(0,0%,100%,0.75)] text-[#6b6d70] mt-1">
                  Write a clear, specific title that will encourage others to
                  join your discussion
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold dark:text-white text-black pb-4">
              Description
            </h2>
            <div className="space-y-2 w-full">
              <h3 className="text-base font-medium text-[#000] dark:text-[#fff]">
                What would you like to discuss?
              </h3>
              <TipTapEditor
                placeholder="Share your thoughts, ask questions, or start a conversation about deals, shopping tips, or anything related to saving money..."
                onSubmit={(content) => setDescription(content)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#f7641b] hover:bg-[#e55a17] text-white px-8 py-2 rounded-lg font-medium"
            >
              Post Discussion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
