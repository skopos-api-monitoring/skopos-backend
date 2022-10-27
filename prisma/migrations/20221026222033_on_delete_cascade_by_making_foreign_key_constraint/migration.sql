/*
  Warnings:

  - You are about to drop the column `success` on the `CollectionRun` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the `AssertionResults` table. If the table is not empty, all the data it contains will be lost.
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
ALTER TABLE "Monitor" DROP CONSTRAINT "Monitor_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_collectionRunId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_requestId_fkey";

-- AlterTable
ALTER TABLE "Assertion" ALTER COLUMN "requestId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CollectionRun" DROP COLUMN "success",
ALTER COLUMN "collectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Monitor" ALTER COLUMN "collectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "collectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "requestId",
ADD COLUMN     "requestBody" JSONB,
ADD COLUMN     "requestHeaders" JSONB,
ADD COLUMN     "requestMethod" TEXT NOT NULL,
ADD COLUMN     "requestStepNumber" INTEGER NOT NULL,
ADD COLUMN     "requestTitle" TEXT NOT NULL,
ADD COLUMN     "requestUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "AssertionResults";

-- CreateTable
CREATE TABLE "AssertionResult" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseId" INTEGER,
    "pass" BOOLEAN NOT NULL,
    "property" TEXT NOT NULL,
    "comparision" TEXT NOT NULL,
    "expected" TEXT NOT NULL,

    CONSTRAINT "AssertionResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionRun" ADD CONSTRAINT "CollectionRun_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_collectionRunId_fkey" FOREIGN KEY ("collectionRunId") REFERENCES "CollectionRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssertionResult" ADD CONSTRAINT "AssertionResult_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
