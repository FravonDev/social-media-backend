/*
  Warnings:

  - You are about to drop the column `exoiresAt` on the `ConfirmationCode` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `ConfirmationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConfirmationCode" DROP COLUMN "exoiresAt",
ADD COLUMN     "ConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "code" SET DATA TYPE TEXT;
