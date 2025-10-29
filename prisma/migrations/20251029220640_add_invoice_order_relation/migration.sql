-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "invoiceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "paymentDate" DATETIME,
    "subtotal" REAL NOT NULL,
    "total" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "notes" TEXT,
    "internalNotes" TEXT,
    "bankAccountId" TEXT,
    "reminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastReminderDate" DATETIME,
    "legalNotice" TEXT,
    "pdfUrl" TEXT,
    "sentAt" DATETIME,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoice_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("bankAccountId", "createdAt", "currency", "customerId", "dueDate", "emailSent", "id", "internalNotes", "invoiceDate", "invoiceNumber", "lastReminderDate", "legalNotice", "notes", "paymentDate", "paymentStatus", "pdfUrl", "reminderCount", "sentAt", "status", "subtotal", "total", "updatedAt") SELECT "bankAccountId", "createdAt", "currency", "customerId", "dueDate", "emailSent", "id", "internalNotes", "invoiceDate", "invoiceNumber", "lastReminderDate", "legalNotice", "notes", "paymentDate", "paymentStatus", "pdfUrl", "reminderCount", "sentAt", "status", "subtotal", "total", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
