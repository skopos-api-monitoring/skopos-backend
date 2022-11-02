/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `env` on the `Monitor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Monitor" DROP CONSTRAINT "Monitor_collectionId_fkey";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "monitorId" INTEGER;

-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "collectionId",
DROP COLUMN "env";

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
