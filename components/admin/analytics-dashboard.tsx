"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, ExternalLink, Users } from "lucide-react";

interface ClickData {
  id: string;
  slug: string;
  type: string;
  originalUrl: string;
  finalUrl: string;
  merchant: string;
  userAgent: string;
  ipAddress: string;
  referer: string;
  createdAt: string;
}

interface AnalyticsStats {
  merchant: string;
  type: string;
  _count: {
    id: number;
  };
}

interface DailyStats {
  date: string;
  clicks: number;
  merchants: number;
}

interface AnalyticsResponse {
  clicks: ClickData[];
  totalCount: number;
  stats: AnalyticsStats[];
  dailyStats: DailyStats[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedMerchant) params.append("merchant", selectedMerchant);
      if (selectedType) params.append("type", selectedType);

      const response = await fetch(
        `/api/analytics/clicks?${params.toString()}`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMerchant, selectedType]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={selectedMerchant}
          onChange={(e) => setSelectedMerchant(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Merchants</option>
          {Array.from(new Set(analytics.stats.map((s) => s.merchant))).map(
            (merchant) => (
              <option key={merchant} value={merchant}>
                {merchant}
              </option>
            )
          )}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="deal">Deals</option>
          <option value="coupon">Coupons</option>
        </select>

        <Button onClick={fetchAnalytics} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Clicks
                </p>
                <p className="text-2xl font-bold">{analytics.totalCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Unique Merchants
                </p>
                <p className="text-2xl font-bold">
                  {new Set(analytics.stats.map((s) => s.merchant)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today's Clicks
                </p>
                <p className="text-2xl font-bold">
                  {analytics.dailyStats[0]?.clicks || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Merchants */}
      <Card>
        <CardHeader>
          <CardTitle>Top Merchants by Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.stats.slice(0, 10).map((stat, index) => (
              <div
                key={`${stat.merchant}-${stat.type}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <span className="font-medium">{stat.merchant}</span>
                  <Badge
                    variant={stat.type === "deal" ? "default" : "secondary"}
                  >
                    {stat.type}
                  </Badge>
                </div>
                <span className="font-bold text-orange-500">
                  {stat._count.id}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Clicks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.clicks.slice(0, 20).map((click) => (
              <div
                key={click.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{click.merchant}</span>
                    <Badge
                      variant={click.type === "deal" ? "default" : "secondary"}
                    >
                      {click.type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(click.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {click.slug}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(click.finalUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
