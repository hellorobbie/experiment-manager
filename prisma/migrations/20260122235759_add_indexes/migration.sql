-- CreateIndex
CREATE INDEX "AuditLog_experimentId_idx" ON "AuditLog"("experimentId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Experiment_status_idx" ON "Experiment"("status");

-- CreateIndex
CREATE INDEX "Experiment_ownerId_idx" ON "Experiment"("ownerId");

-- CreateIndex
CREATE INDEX "Experiment_createdAt_idx" ON "Experiment"("createdAt");

-- CreateIndex
CREATE INDEX "Experiment_updatedAt_idx" ON "Experiment"("updatedAt");
