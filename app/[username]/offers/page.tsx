"use client";

import { UsernamePageWrapper } from "@/components/username-page-wrapper";

export default function OffersPage() {
  return (
    <UsernamePageWrapper offersCount={5} commentsCount={12}>
      <div className="w-[1000px] mx-auto px-4 py-8">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Offers Page
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your offers content goes here...
          </p>
        </div>
      </div>
    </UsernamePageWrapper>
  );
}
