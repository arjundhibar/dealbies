-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'site-settings',
    "site_title" TEXT NOT NULL DEFAULT 'DealHunter - Find the Best Deals & Coupons',
    "meta_description" TEXT NOT NULL DEFAULT 'Discover amazing deals, discounts, and coupons from top retailers. Join our community to share and find the best savings on electronics, fashion, home goods, and more.',
    "site_name" TEXT NOT NULL DEFAULT 'DealHunter',
    "og_image" TEXT DEFAULT '/og-image.jpg',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
