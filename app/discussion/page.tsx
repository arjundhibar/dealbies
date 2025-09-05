import { DiscussionsList } from "@/components/discussions-list";

export default function DiscussionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discussions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join the conversation and share your thoughts with the community
        </p>
      </div>

      <DiscussionsList showHeader={false} category="all" />
    </div>
  );
}
