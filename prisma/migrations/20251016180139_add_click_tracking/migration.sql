-- CreateTable
CREATE TABLE "click_tracking" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "final_url" TEXT NOT NULL,
    "merchant" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "referer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_tracking_pkey" PRIMARY KEY ("id")
);
