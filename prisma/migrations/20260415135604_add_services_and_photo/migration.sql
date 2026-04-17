/*
  Warnings:

  - You are about to drop the column `email` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required column `services` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("createdAt", "id", "message", "name", "rating", "updatedAt", "voucher") SELECT "createdAt", "id", "message", "name", "rating", "updatedAt", "voucher" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
