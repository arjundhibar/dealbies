import { DealsList } from "@/components/deals-list"
import { notFound } from "next/navigation"

const validCategories = ["tech", "fashion", "home", "travel", "gaming", "food", "beauty", "auto", "kids", "other"]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug

  if (!validCategories.includes(category.toLowerCase())) {
    notFound()
  }

  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

  return (
    <div className="container mx-auto py-6 px-4">
      <DealsList category={formattedCategory} />
    </div>
  )
}
