/*
  Warnings:

  - You are about to drop the column `followingId` on the `Follow` table. All the data in the column will be lost.
  - Added the required column `followedId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "followingId",
ADD COLUMN     "followedId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
