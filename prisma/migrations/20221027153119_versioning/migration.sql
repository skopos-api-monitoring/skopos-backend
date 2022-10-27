/*
  Warnings:

  - You are about to drop the column `comparision` on the `AssertionResult` table. All the data in the column will be lost.
  - You are about to drop the column `expected` on the `AssertionResult` table. All the data in the column will be lost.
  - You are about to drop the column `property` on the `AssertionResult` table. All the data in the column will be lost.
  - You are about to drop the column `requestBody` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `requestHeaders` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `requestMethod` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `requestStepNumber` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `requestTitle` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `requestUrl` on the `Response` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssertionResult" DROP COLUMN "comparision",
DROP COLUMN "expected",
DROP COLUMN "property";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "requestBody",
DROP COLUMN "requestHeaders",
DROP COLUMN "requestMethod",
DROP COLUMN "requestStepNumber",
DROP COLUMN "requestTitle",
DROP COLUMN "requestUrl",
ADD COLUMN     "requestId" INTEGER;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
