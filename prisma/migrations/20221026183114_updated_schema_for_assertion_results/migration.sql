/*
  Warnings:

  - You are about to drop the column `assertionId` on the `AssertionResults` table. All the data in the column will be lost.
  - You are about to drop the column `success` on the `CollectionRun` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `Response` table. All the data in the column will be lost.
  - Added the required column `comparision` to the `AssertionResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected` to the `AssertionResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property` to the `AssertionResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestMethod` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestStepNumber` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestTitle` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestUrl` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssertionResults" DROP CONSTRAINT "AssertionResults_assertionId_fkey";

-- DropForeignKey
ALTER TABLE "AssertionResults" DROP CONSTRAINT "AssertionResults_responseId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionRun" DROP CONSTRAINT "CollectionRun_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_collectionRunId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_requestId_fkey";

-- AlterTable
ALTER TABLE "AssertionResults" DROP COLUMN "assertionId",
ADD COLUMN     "comparision" TEXT NOT NULL,
ADD COLUMN     "expected" TEXT NOT NULL,
ADD COLUMN     "property" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CollectionRun" DROP COLUMN "success";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "requestId",
ADD COLUMN     "requestBody" JSONB,
ADD COLUMN     "requestHeaders" JSONB,
ADD COLUMN     "requestMethod" TEXT NOT NULL,
ADD COLUMN     "requestStepNumber" INTEGER NOT NULL,
ADD COLUMN     "requestTitle" TEXT NOT NULL,
ADD COLUMN     "requestUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CollectionRun" ADD CONSTRAINT "CollectionRun_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_collectionRunId_fkey" FOREIGN KEY ("collectionRunId") REFERENCES "CollectionRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssertionResults" ADD CONSTRAINT "AssertionResults_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
