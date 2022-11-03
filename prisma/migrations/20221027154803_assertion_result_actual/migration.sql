/*
  Warnings:

  - Added the required column `actual` to the `AssertionResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Monitor" DROP CONSTRAINT "Monitor_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_collectionId_fkey";

-- AlterTable
ALTER TABLE "Assertion" ALTER COLUMN "requestId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AssertionResult" ADD COLUMN     "actual" TEXT NOT NULL,
ALTER COLUMN "responseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CollectionRun" ALTER COLUMN "collectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Monitor" ALTER COLUMN "collectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "collectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
