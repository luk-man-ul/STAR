-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "measurementId" TEXT;

-- CreateIndex
CREATE INDEX "bookings_measurementId_idx" ON "bookings"("measurementId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
