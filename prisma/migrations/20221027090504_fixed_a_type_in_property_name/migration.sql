/*
  Warnings:

  - You are about to drop the column `comparision` on the `AssertionResult` table. All the data in the column will be lost.
  - Added the required column `comparison` to the `AssertionResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssertionResult" DROP COLUMN "comparision",
ADD COLUMN     "comparison" TEXT NOT NULL;
