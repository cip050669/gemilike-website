-- CreateTable
CREATE TABLE "CheckoutEvent" (
    "id" TEXT NOT NULL,
    "cartId" TEXT,
    "customerId" TEXT,
    "sessionId" TEXT,
    "step" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "duration" INTEGER,
    "metadata" JSONB,
    "error" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckoutEvent_cartId_idx" ON "CheckoutEvent"("cartId");

-- CreateIndex
CREATE INDEX "CheckoutEvent_customerId_idx" ON "CheckoutEvent"("customerId");

-- CreateIndex
CREATE INDEX "CheckoutEvent_sessionId_idx" ON "CheckoutEvent"("sessionId");

-- CreateIndex
CREATE INDEX "CheckoutEvent_step_idx" ON "CheckoutEvent"("step");

-- CreateIndex
CREATE INDEX "CheckoutEvent_createdAt_idx" ON "CheckoutEvent"("createdAt");

-- CreateIndex
CREATE INDEX "CheckoutEvent_cartId_step_idx" ON "CheckoutEvent"("cartId", "step");

-- AddForeignKey
ALTER TABLE "CheckoutEvent" ADD CONSTRAINT "CheckoutEvent_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutEvent" ADD CONSTRAINT "CheckoutEvent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
