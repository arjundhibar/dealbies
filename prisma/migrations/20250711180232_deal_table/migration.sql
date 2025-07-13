/*
  Warnings:

  - You are about to drop the column `image_url` on the `deals` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "deals" DROP COLUMN "image_url",
ADD COLUMN     "availability" "Availability",
ADD COLUMN     "discount_code" TEXT,
ADD COLUMN     "postage_costs" DECIMAL(10,2),
ADD COLUMN     "shipping_from" TEXT,
ADD COLUMN     "start_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "deal_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "deal_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deal_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deal_images" ADD CONSTRAINT "deal_images_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
