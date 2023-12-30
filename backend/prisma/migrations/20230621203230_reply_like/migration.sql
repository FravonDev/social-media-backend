/*
  Warnings:

  - You are about to drop the `ReplyLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReplyLikes" DROP CONSTRAINT "ReplyLikes_replyId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyLikes" DROP CONSTRAINT "ReplyLikes_userId_fkey";

-- DropTable
DROP TABLE "ReplyLikes";

-- CreateTable
CREATE TABLE "ReplyLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReplyLike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReplyLike" ADD CONSTRAINT "ReplyLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyLike" ADD CONSTRAINT "ReplyLike_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
