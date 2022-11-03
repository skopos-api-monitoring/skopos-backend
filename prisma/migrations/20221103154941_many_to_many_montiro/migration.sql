/*
  Warnings:

  - You are about to drop the column `monitorId` on the `Collection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_monitorId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "monitorId";

-- CreateTable
CREATE TABLE "MonitorCollections" (
    "id" SERIAL NOT NULL,
    "monitorId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "MonitorCollections_pkey" PRIMARY KEY ("id")
);
