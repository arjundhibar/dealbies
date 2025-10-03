// app/not-found.tsx - Custom 404 page

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sorry, we couldn't find the page you're looking for. The page
                might have been moved, deleted, or you might have entered the
                wrong URL.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/deals">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Deals
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you think this is an error, please{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
