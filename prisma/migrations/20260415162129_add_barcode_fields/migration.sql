-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN "voucherId" TEXT;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN "barcode" TEXT;

-- CreateIndex
CREATE INDEX "Testimonial_voucherId_idx" ON "Testimonial"("voucherId");

-- CreateIndex
CREATE INDEX "Voucher_barcode_idx" ON "Voucher"("barcode");
