-- AlterTable
ALTER TABLE "measurements" ADD COLUMN "profileName" TEXT NOT NULL DEFAULT 'My Measurements';
ALTER TABLE "measurements" ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- DropIndex
DROP INDEX "measurements_userId_key";

-- Update existing measurements to be default
UPDATE "measurements" SET "isDefault" = true;

-- CreateIndex
CREATE INDEX "measurements_userId_idx" ON "measurements"("userId");
