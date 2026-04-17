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
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("createdAt", "id", "message", "name", "photo", "rating", "services", "updatedAt", "voucher", "whatsapp") SELECT "createdAt", "id", "message", "name", "photo", "rating", "services", "updatedAt", "voucher", "whatsapp" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
CREATE INDEX "Testimonial_approved_idx" ON "Testimonial"("approved");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
