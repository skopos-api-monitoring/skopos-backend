/*
  Warnings:

  - Made the column `collectionId` on table `CollectionRun` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CollectionRun" ALTER COLUMN "collectionId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "AssertionResult_id_responseId_idx" ON "AssertionResult"("id", "responseId");

-- CreateIndex
CREATE INDEX "Collection_id_monitorId_idx" ON "Collection"("id", "monitorId");

-- CreateIndex
CREATE INDEX "CollectionRun_id_collectionId_idx" ON "CollectionRun"("id", "collectionId");

-- CreateIndex
CREATE INDEX "Request_id_collectionId_idx" ON "Request"("id", "collectionId");

-- CreateIndex
CREATE INDEX "Response_id_collectionRunId_requestId_idx" ON "Response"("id", "collectionRunId", "requestId");
