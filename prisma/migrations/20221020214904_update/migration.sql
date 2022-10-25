-- CreateTable
CREATE TABLE "AssertionResults" (
    "id" SERIAL NOT NULL,
    "actual" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "assertionId" INTEGER NOT NULL,
    "responseId" INTEGER NOT NULL,
    "pass" BOOLEAN NOT NULL,

    CONSTRAINT "AssertionResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssertionResults" ADD CONSTRAINT "AssertionResults_assertionId_fkey" FOREIGN KEY ("assertionId") REFERENCES "Assertion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssertionResults" ADD CONSTRAINT "AssertionResults_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
