/*
  Warnings:

  - You are about to drop the column `actual` on the `AssertionResults` table. All the data in the column will be lost.
  - Added the required column `comparison` to the `Assertion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assertion" ADD COLUMN     "comparison" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AssertionResults" DROP COLUMN "actual",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "collectionRunId" INTEGER;

-- CreateTable
CREATE TABLE "CollectionRun" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "CollectionRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionRun" ADD CONSTRAINT "CollectionRun_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_collectionRunId_fkey" FOREIGN KEY ("collectionRunId") REFERENCES "CollectionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
