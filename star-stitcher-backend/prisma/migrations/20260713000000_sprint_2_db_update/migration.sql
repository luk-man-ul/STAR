-- 1. Create Custom Enums for V2 Workflow
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'OTHER');
CREATE TYPE "FabricSource" AS ENUM ('CUSTOMER_PROVIDED', 'SHOP_PROVIDED');
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CONFIRMED', 'MEASUREMENT_UPDATED', 'STATUS_CHANGED', 'PAYMENT_RECEIVED');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- 2. Drop Obsolete V1 Tables
DROP TABLE IF EXISTS "pricing_tiers" CASCADE;
DROP TABLE IF EXISTS "design_gallery" CASCADE;

-- 3. Rename "services" table to "categories"
ALTER TABLE "services" RENAME TO "categories";
ALTER TABLE "categories" DROP COLUMN IF EXISTS "category";
ALTER TABLE "categories" DROP COLUMN IF EXISTS "estimatedDays";
ALTER TABLE "categories" DROP COLUMN IF EXISTS "requiresMeasurements";

-- Ensure index and constraints are properly configured for categories
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "services_pkey" CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name");

-- 4. Create "designs" Table
CREATE TABLE "designs" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on design code
CREATE UNIQUE INDEX "designs_code_key" ON "designs"("code");

-- Add foreign key constraint to categories
ALTER TABLE "designs" ADD CONSTRAINT "designs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Modify "measurements" Table
-- Add sizing parameters and verification metrics
ALTER TABLE "measurements" ADD COLUMN "measurementSource" "MeasurementSource" NOT NULL DEFAULT 'ONLINE';
ALTER TABLE "measurements" ADD COLUMN "verifiedByShop" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "measurements" ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "measurements" ADD COLUMN "notes" TEXT;
ALTER TABLE "measurements" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- Add customized sizing metrics for Blouse/Kurti/Pants patterns
ALTER TABLE "measurements" ADD COLUMN "underBust" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "armHole" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "sleeveRound" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "frontNeckDepth" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "backNeckDepth" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "bottomRound" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "shoulder" DOUBLE PRECISION;
ALTER TABLE "measurements" ADD COLUMN "neck" DOUBLE PRECISION;

-- Add dynamic JSON field for additional sizing extensions
ALTER TABLE "measurements" ADD COLUMN "additionalMeasurements" JSONB;

-- Drop deprecated columns if they exist
ALTER TABLE "measurements" DROP COLUMN IF EXISTS "source";

-- 6. Modify "orders" Table
-- Drop old foreign keys and columns
ALTER TABLE "orders" DROP COLUMN IF EXISTS "serviceId";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "pricingTierId";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "designGalleryId";

-- Add design relationship link
ALTER TABLE "orders" ADD COLUMN "designId" TEXT NOT NULL;

-- Add delivery and delivery date tracking attributes
ALTER TABLE "orders" ADD COLUMN "expectedDeliveryDate" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "actualDeliveryDate" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "pickupDate" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "deliveryProvider" TEXT;
ALTER TABLE "orders" ADD COLUMN "trackingNumber" TEXT;

-- Add pricing updates and overrides
ALTER TABLE "orders" ADD COLUMN "finalPrice" DOUBLE PRECISION NOT NULL;
ALTER TABLE "orders" ADD COLUMN "priceOverrideReason" TEXT;

-- Add urgency indicators
ALTER TABLE "orders" ADD COLUMN "isUrgent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "orders" ADD COLUMN "rushFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- Add fabric tracking fields
ALTER TABLE "orders" ADD COLUMN "fabricSource" "FabricSource" NOT NULL DEFAULT 'CUSTOMER_PROVIDED';
ALTER TABLE "orders" ADD COLUMN "fabricDescription" TEXT;
ALTER TABLE "orders" ADD COLUMN "fabricImageUrl" TEXT;
ALTER TABLE "orders" ADD COLUMN "fabricReceived" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "orders" ADD COLUMN "fabricReceivedAt" TIMESTAMP(3);

-- Add custom reference style links
ALTER TABLE "orders" ADD COLUMN "styleReferences" JSONB;

-- Add payment status and metrics
ALTER TABLE "orders" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
ALTER TABLE "orders" ADD COLUMN "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
ALTER TABLE "orders" ADD COLUMN "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- Configure new foreign key constraints
ALTER TABLE "orders" ADD CONSTRAINT "orders_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 7. Create "payment_transactions" Table
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'UPI',
    "transactionReference" TEXT,
    "notes" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 8. Create "notification_logs" Table
CREATE TABLE "notification_logs" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "recipientPhone" TEXT NOT NULL,
    "messageBody" TEXT NOT NULL,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
