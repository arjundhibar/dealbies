/*
  Warnings:

  - You are about to drop the column `code` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `merchant` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `coupons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availability` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coupon_url` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_code` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_type` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "code",
DROP COLUMN "logo_url",
DROP COLUMN "merchant",
DROP COLUMN "terms",
ADD COLUMN     "availability" "Availability" NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "coupon_url" TEXT NOT NULL,
ADD COLUMN     "discount_code" TEXT NOT NULL,
ADD COLUMN     "discount_type" TEXT NOT NULL,
ADD COLUMN     "discount_value" DECIMAL(10,2),
ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "start_at" TIMESTAMP(3),
ALTER COLUMN "expires_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "coupon_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cloudflareUrl" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "coupon_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupon_images_slug_key" ON "coupon_images"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_slug_key" ON "coupons"("slug");

-- AddForeignKey
ALTER TABLE "coupon_images" ADD CONSTRAINT "coupon_images_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
