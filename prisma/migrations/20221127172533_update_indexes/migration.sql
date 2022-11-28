-- DropIndex
DROP INDEX "AssertionResult_id_responseId_idx";

-- CreateIndex
CREATE INDEX "Assertion_id_requestId_idx" ON "Assertion"("id", "requestId");

-- CreateIndex
CREATE INDEX "AssertionResult_id_assertionId_responseId_idx" ON "AssertionResult"("id", "assertionId", "responseId");
