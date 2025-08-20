"use client";

import { DealsList } from "@/components/deals-list";
import { DealFilters } from "@/components/deal-filters";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Filter, SortAsc } from "lucide-react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useState, useEffect, useMemo } from "react";

// Updated valid categories to match your sidebar
const validCategories = [
  "electronics",
  "gaming",
  "groceries",
  "fashion",
  "beauty",
  "family",
  "home",
  "garden",
  "car",
  "culture",
  "sports",
  "telecom",
  "money",
  "services-and-contracts",
  "to-travel",
];

// Mapping between URL slugs and display names
const categoryDisplayNames: Record<string, string> = {
  electronics: "Electronics",
  gaming: "Gaming",
  groceries: "Groceries",
  fashion: "Fashion & Accessories",
  beauty: "Beauty & Health",
  family: "Family & Children",
  home: "Home & Living",
  garden: "Garden & DIY",
  car: "Car & Motorcycle",
  culture: "Culture & Leisure",
  sports: "Sports & Outdoors",
  telecom: "Telecom & Internet",
  money: "Money Matters & Insurance",
  "services-and-contracts": "Services & Contracts",
  "to-travel": "To travel",
};

// Reverse mapping from URL slugs to exact database category names
const categoryDatabaseNames: Record<string, string> = {
  electronics: "Electronics",
  gaming: "Gaming",
  groceries: "Groceries",
  fashion: "Fashion & Accessories",
  beauty: "Beauty & Health",
  family: "Family & Children",
  home: "Home & Living",
  garden: "Garden & DIY",
  car: "Car & Motorcycle",
  culture: "Culture & Leisure",
  sports: "Sports & Outdoors",
  telecom: "Telecom & Internet",
  money: "Money Matters & Insurance",
  "services-and-contracts": "Services & Contracts",
  "to-travel": "To travel",
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [category, setCategory] = useState<string>("");
  const [formattedCategory, setFormattedCategory] = useState<string>("");
  const { scrollDirection, isScrolled } = useScrollDirection();

  // Filter states
  const [sortBy, setSortBy] = useState("newest");
  const [hideExpired, setHideExpired] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [temperatureFilter, setTemperatureFilter] = useState("each");
  const [minTemp, setMinTemp] = useState(0);
  const [maxTemp, setMaxTemp] = useState(9999);

  // Memoize filters object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => ({
      sortBy,
      hideExpired,
      minPrice,
      maxPrice,
      temperatureFilter,
      minTemp,
      maxTemp,
    }),
    [
      sortBy,
      hideExpired,
      minPrice,
      maxPrice,
      temperatureFilter,
      minTemp,
      maxTemp,
    ]
  );

  useEffect(() => {
    const loadParams = async () => {
      const { slug } = await params;
      const categoryValue = slug;

      console.log("Category page - Slug received:", slug);
      console.log("Category page - Category value:", categoryValue);
      console.log("Category page - Valid categories:", validCategories);

      if (!validCategories.includes(categoryValue.toLowerCase())) {
        console.log("Category page - Category not found in valid categories");
        notFound();
      }

      setCategory(categoryValue);
      // Use the display name mapping instead of just capitalizing
      const displayName = categoryDisplayNames[categoryValue] || categoryValue;
      const databaseCategory =
        categoryDatabaseNames[categoryValue] || categoryValue;
      console.log("Category page - Display name:", displayName);
      console.log("Category page - Database category:", databaseCategory);
      setFormattedCategory(displayName);
    };

    loadParams();
  }, [params]);

  // Reset all filters
  const resetFilters = () => {
    setSortBy("newest");
    setHideExpired(false);
    setMinPrice(0);
    setMaxPrice(9999);
    setTemperatureFilter("each");
    setMinTemp(0);
    setMaxTemp(9999);
  };

  if (!category) {
    return null; // Loading state
  }

  return (
    <>
      {/* Breadcrumb Navigation - Hidden on scroll up */}
      <div
        className={`sticky top-0 -mt-6 -mr-28 -ml-28 bg-background text-foreground border-b dark:bg-[#1d1f20] transition-transform duration-300 ${
          scrollDirection === "down" && isScrolled
            ? "transform -translate-y-full"
            : "transform translate-y-0"
        }`}
      >
        <div className="mx-auto max-w-[82.5rem] px-4 w-full box-border">
          <div className="flex items-center h-14">
            <div className="flex items-center gap-2 text-xs text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors hover:underline"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)] font-medium">
                {formattedCategory}
              </span>
            </div>
          </div>

          {/* Category Header - Hidden on scroll up */}
          <div
            className={`mb-6 transition-all duration-300 ${
              scrollDirection === "down" && isScrolled
                ? "opacity-0 h-0 overflow-hidden"
                : "opacity-100 h-auto"
            }`}
          >
            <h1 className="text-5xl text-black dark:text-white leading-[62px] font-semibold mb-2">
              {formattedCategory}
            </h1>
            <p className="text-[rgba(4,8,13,0.59)] dark:text-[hsla(0,0%,100%,0.75)]">
              Discover the best deals and discounts in{" "}
              {formattedCategory.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Category Content */}
      <div className="mx-auto max-w-[82.5rem] px-4 w-full box-border py-2">
        {/* Main Content Grid - Filter Card on Left, Deals List on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filter Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-white dark:bg-dark-secondary">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-black dark:text-white text-xl -ml-2 font-semibold">
                    Filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline p-0 h-auto font-normal"
                  >
                    Reset
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sort Options */}
                  <div className="-ml-2">
                    <h4 className="font-semibold mb-3 text-lg text-gray-700 dark:text-gray-300">
                      Sort
                    </h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none"
                    >
                      <option value="newest">Most Recent</option>
                      <option value="hottest">Hottest</option>
                      <option value="most-comments">Most Comments</option>
                      <option value="ending-soon">Ending Soon</option>
                    </select>
                  </div>

                  {/* Divider */}
                  <div className="border-t w-full border-gray-200 dark:border-gray-600"></div>

                  {/* View Options */}
                  <div className="-ml-2">
                    <h4 className="font-semibold mb-4 text-lg text-gray-700 dark:text-gray-300">
                      View Options
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hide-expired"
                        checked={hideExpired}
                        onChange={(e) => setHideExpired(e.target.checked)}
                        className="peer hidden"
                      />
                      <label
                        htmlFor="hide-expired"
                        className="relative w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center cursor-pointer
               peer-checked:before:content-['✔'] peer-checked:before:text-orange-500 peer-checked:before:text-[14px]"
                      ></label>
                      <span className="text-[12.25px] text-black dark:text-white">
                        Hide Expired
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>

                  {/* Price Range */}
                  <div className="-ml-2">
                    <h4 className="font-semibold mb-3 text-lg text-gray-700 dark:text-gray-300">
                      Price
                    </h4>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) =>
                            setMinPrice(
                              Math.min(Number(e.target.value), maxPrice - 1)
                            )
                          }
                          className="w-full border border-[rgba(3,12,25,0.23)] rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none pl-7 py-[9px] pr-[16px] placeholder:text-[2.5em]"
                        />
                      </div>

                      <span className="text-gray-500">-</span>

                      <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) =>
                            setMaxPrice(
                              Math.max(Number(e.target.value), minPrice + 1)
                            )
                          }
                          className="w-full border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none pl-7 py-[9px] pr-[16px] placeholder:text-[2.5em]"
                        />
                      </div>
                    </div>

                    {/* --- Range Slider --- */}
                    <div className="relative w-full">
                      {/* Track highlight */}
                      <div className="absolute top-1/2 h-2 w-full rounded-lg bg-gray-300 -translate-y-1/2"></div>
                      <div
                        className="absolute top-1/2 h-2 rounded-lg bg-orange-500 -translate-y-1/2"
                        style={{
                          left: `${(minPrice / 9999) * 100}%`,
                          right: `${100 - (maxPrice / 9999) * 100}%`,
                        }}
                      ></div>

                      {/* Min slider */}
                      <input
                        type="range"
                        min="0"
                        max="9999"
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(
                            Math.min(Number(e.target.value), maxPrice - 1)
                          )
                        }
                        className="absolute -mt-2 w-full appearance-none bg-transparent
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 
                     [&::-webkit-slider-thumb]:cursor-pointer 
                     pointer-events-auto"
                      />

                      {/* Max slider */}
                      <input
                        type="range"
                        min="0"
                        max="9999"
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(
                            Math.max(Number(e.target.value), minPrice + 1)
                          )
                        }
                        className="absolute -mt-2 w-full appearance-none bg-transparent 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 
                     [&::-webkit-slider-thumb]:cursor-pointer 
                     pointer-events-auto"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>

                  {/* Temperature Section */}
                  <div className="-ml-2">
                    <h4 className="font-semibold mb-3 text-lg text-gray-700 dark:text-gray-300">
                      Temperature
                    </h4>
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="temp-each"
                          name="temperature"
                          value="each"
                          checked={temperatureFilter === "each"}
                          onChange={(e) => setTemperatureFilter(e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="temp-each"
                          className="text-base text-gray-700 dark:text-gray-300"
                        >
                          Each
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="temp-20"
                          name="temperature"
                          value="20"
                          checked={temperatureFilter === "20"}
                          onChange={(e) => setTemperatureFilter(e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="temp-20"
                          className="text-[12.25px] text-gray-700 dark:text-gray-300"
                        >
                          20° & higher
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="temp-100"
                          name="temperature"
                          value="100"
                          checked={temperatureFilter === "100"}
                          onChange={(e) => setTemperatureFilter(e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="temp-100"
                          className="text-[12.25px] text-gray-700 dark:text-gray-300"
                        >
                          100° & higher
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="temp-200"
                          name="temperature"
                          value="200"
                          checked={temperatureFilter === "200"}
                          onChange={(e) => setTemperatureFilter(e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="temp-200"
                          className="text-[12.25px] text-gray-700 dark:text-gray-300"
                        >
                          200° & higher
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={minTemp}
                        onChange={(e) => setMinTemp(Number(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="9999"
                        value={maxTemp}
                        onChange={(e) => setMaxTemp(Number(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Deals List */}
          <div className="lg:col-span-3">
            <DealsList
              category={categoryDatabaseNames[category] || category}
              showHeader={false}
              filters={memoizedFilters}
              onFiltersReset={resetFilters}
            />
          </div>
        </div>
      </div>
    </>
  );
}
