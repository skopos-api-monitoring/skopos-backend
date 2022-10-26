/*
  Warnings:

  - You are about to drop the `AssertionResults` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssertionResults" DROP CONSTRAINT "AssertionResults_responseId_fkey";

-- DropTable
DROP TABLE "AssertionResults";

-- CreateTable
CREATE TABLE "AssertionResult" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseId" INTEGER NOT NULL,
    "pass" BOOLEAN NOT NULL,
    "property" TEXT NOT NULL,
    "comparision" TEXT NOT NULL,
    "expected" TEXT NOT NULL,

    CONSTRAINT "AssertionResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssertionResult" ADD CONSTRAINT "AssertionResult_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
