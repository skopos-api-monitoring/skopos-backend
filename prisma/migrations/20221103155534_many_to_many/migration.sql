/*
  Warnings:

  - You are about to drop the `MonitorCollections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MonitorCollections";

-- CreateTable
CREATE TABLE "MonitorsOnCollections" (
    "collectionId" INTEGER NOT NULL,
    "monitorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitorsOnCollections_pkey" PRIMARY KEY ("collectionId","monitorId")
);

-- AddForeignKey
ALTER TABLE "MonitorsOnCollections" ADD CONSTRAINT "MonitorsOnCollections_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorsOnCollections" ADD CONSTRAINT "MonitorsOnCollections_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
