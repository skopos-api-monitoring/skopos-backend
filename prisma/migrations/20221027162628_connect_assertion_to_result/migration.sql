-- AddForeignKey
ALTER TABLE "AssertionResult" ADD CONSTRAINT "AssertionResult_assertionId_fkey" FOREIGN KEY ("assertionId") REFERENCES "Assertion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
