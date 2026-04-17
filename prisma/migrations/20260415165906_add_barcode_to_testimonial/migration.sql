-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN "barcode" TEXT;

-- CreateIndex
CREATE INDEX "Testimonial_barcode_idx" ON "Testimonial"("barcode");
