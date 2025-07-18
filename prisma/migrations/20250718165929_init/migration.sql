/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `deals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `deal_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `deals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deal_images" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "deals" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "deals_slug_key" ON "deals"("slug");
