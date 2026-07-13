-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterEnum
-- Postgres enums can be expanded with ADD VALUE
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- Update existing user rows to mapping Role.OWNER -> Role.ADMIN
UPDATE "users" SET "role" = 'ADMIN'::"Role" WHERE "role"::text = 'OWNER';

-- CreateTable "shop_settings"
CREATE TABLE "shop_settings" (
    "id" TEXT NOT NULL DEFAULT 'default-settings',
    "status" "BusinessStatus" NOT NULL DEFAULT 'OPEN',
    "shopName" TEXT NOT NULL DEFAULT 'Star Stitcher',
    "logoUrl" TEXT,
    "aboutShop" TEXT,
    "phone" TEXT NOT NULL DEFAULT '+91 7306417315',
    "whatsapp" TEXT NOT NULL DEFAULT '+91 7306417315',
    "email" TEXT NOT NULL DEFAULT 'starstitcherladiescentre@gmail.com',
    "address" TEXT NOT NULL DEFAULT 'KRP Rao Road, Kasaragod, Kerala',
    "googleMapsLink" TEXT,
    "enableHomeDelivery" BOOLEAN NOT NULL DEFAULT true,
    "enablePickup" BOOLEAN NOT NULL DEFAULT true,
    "deliveryCharges" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "appointmentDuration" INTEGER NOT NULL DEFAULT 30,
    "maxAppointmentsPerSlot" INTEGER NOT NULL DEFAULT 1,
    "heroHeading" TEXT NOT NULL DEFAULT 'Exquisite Custom Tailoring',
    "heroSubheading" TEXT NOT NULL DEFAULT 'Crafting perfect designs for every occasion',
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable "business_hours"
CREATE TABLE "business_hours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openTime" TEXT NOT NULL DEFAULT '10:00',
    "closeTime" TEXT NOT NULL DEFAULT '18:30',
    "settingsId" TEXT NOT NULL,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable "holidays"
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "holidayDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "settingsId" TEXT NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_settingsId_dayOfWeek_key" ON "business_hours"("settingsId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_settingsId_holidayDate_key" ON "holidays"("settingsId", "holidayDate");

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "shop_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "shop_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
