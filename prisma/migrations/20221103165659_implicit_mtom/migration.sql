/*
  Warnings:

  - You are about to drop the `MonitorsOnCollections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MonitorsOnCollections" DROP CONSTRAINT "MonitorsOnCollections_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "MonitorsOnCollections" DROP CONSTRAINT "MonitorsOnCollections_monitorId_fkey";

-- DropTable
DROP TABLE "MonitorsOnCollections";

-- CreateTable
CREATE TABLE "_CollectionToMonitor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToMonitor_AB_unique" ON "_CollectionToMonitor"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToMonitor_B_index" ON "_CollectionToMonitor"("B");

-- AddForeignKey
ALTER TABLE "_CollectionToMonitor" ADD CONSTRAINT "_CollectionToMonitor_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToMonitor" ADD CONSTRAINT "_CollectionToMonitor_B_fkey" FOREIGN KEY ("B") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
