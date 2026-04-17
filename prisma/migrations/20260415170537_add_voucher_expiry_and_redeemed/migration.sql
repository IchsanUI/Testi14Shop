-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "photo" TEXT,
    "voucher" TEXT,
    "voucherId" TEXT,
    "barcode" TEXT,
    "voucherRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("approved", "barcode", "createdAt", "id", "message", "name", "photo", "rating", "services", "updatedAt", "voucher", "voucherId", "whatsapp") SELECT "approved", "barcode", "createdAt", "id", "message", "name", "photo", "rating", "services", "updatedAt", "voucher", "voucherId", "whatsapp" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
CREATE INDEX "Testimonial_approved_idx" ON "Testimonial"("approved");
CREATE INDEX "Testimonial_voucherId_idx" ON "Testimonial"("voucherId");
CREATE INDEX "Testimonial_barcode_idx" ON "Testimonial"("barcode");
CREATE TABLE "new_Voucher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "barcode" TEXT,
    "expiryDays" INTEGER NOT NULL DEFAULT 7,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Voucher" ("active", "barcode", "code", "createdAt", "id", "name", "probability", "quota", "updatedAt", "used", "value") SELECT "active", "barcode", "code", "createdAt", "id", "name", "probability", "quota", "updatedAt", "used", "value" FROM "Voucher";
DROP TABLE "Voucher";
ALTER TABLE "new_Voucher" RENAME TO "Voucher";
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");
CREATE INDEX "Voucher_active_idx" ON "Voucher"("active");
CREATE INDEX "Voucher_barcode_idx" ON "Voucher"("barcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
