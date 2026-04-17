/*
  Warnings:

  - Added the required column `name` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `probability` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quota` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Voucher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Voucher" ("active", "code", "createdAt", "id", "updatedAt", "value") SELECT "active", "code", "createdAt", "id", "updatedAt", "value" FROM "Voucher";
DROP TABLE "Voucher";
ALTER TABLE "new_Voucher" RENAME TO "Voucher";
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");
CREATE INDEX "Voucher_active_idx" ON "Voucher"("active");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
