/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `deal_images` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `deal_images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "deal_images" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "deal_images_slug_key" ON "deal_images"("slug");
