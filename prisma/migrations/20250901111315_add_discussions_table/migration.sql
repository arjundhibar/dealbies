/*
  Warnings:

  - A unique constraint covering the columns `[user_id,deal_id,coupon_id,comment_id,discussion_id]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "votes_user_id_deal_id_coupon_id_comment_id_key";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "discussion_id" TEXT;

-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "discussion_id" TEXT;

-- CreateTable
CREATE TABLE "discussions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "deal_category" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discussions_slug_key" ON "discussions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "votes_user_id_deal_id_coupon_id_comment_id_discussion_id_key" ON "votes"("user_id", "deal_id", "coupon_id", "comment_id", "discussion_id");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
