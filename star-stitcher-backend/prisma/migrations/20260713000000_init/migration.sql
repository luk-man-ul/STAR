-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('BOOKED', 'MEASUREMENT_PENDING', 'MEASURED', 'CUTTING', 'STITCHING', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MeasurementSource" AS ENUM ('SHOP', 'ONLINE');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "FabricSource" AS ENUM ('CUSTOMER_PROVIDED', 'SHOP_PROVIDED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CONFIRMED', 'MEASUREMENT_UPDATED', 'STATUS_CHANGED', 'PAYMENT_RECEIVED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'RESCHEDULED', 'ARRIVED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable "users"
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable "addresses"
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable "categories"
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable "designs"
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

-- CreateTable "measurements"
CREATE TABLE "measurements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "measurementSource" "MeasurementSource" NOT NULL DEFAULT 'ONLINE',
    "verifiedByShop" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "bust" DOUBLE PRECISION,
    "underBust" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hip" DOUBLE PRECISION,
    "shoulder" DOUBLE PRECISION,
    "neck" DOUBLE PRECISION,
    "armHole" DOUBLE PRECISION,
    "sleeveLength" DOUBLE PRECISION,
    "sleeveRound" DOUBLE PRECISION,
    "frontNeckDepth" DOUBLE PRECISION,
    "backNeckDepth" DOUBLE PRECISION,
    "totalLength" DOUBLE PRECISION,
    "bottomRound" DOUBLE PRECISION,
    "additionalMeasurements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable "bookings"
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "measurementMethod" "MeasurementSource" NOT NULL DEFAULT 'ONLINE',
    "deliveryMethod" "DeliveryType" NOT NULL DEFAULT 'PICKUP',
    "addressId" TEXT,
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable "appointments"
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable "orders"
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'BOOKED',
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "deliveryType" "DeliveryType" NOT NULL DEFAULT 'PICKUP',
    "addressId" TEXT,
    "specialInstructions" TEXT,
    "measurementSnapshot" JSONB,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "rushFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fabricSource" "FabricSource" NOT NULL DEFAULT 'CUSTOMER_PROVIDED',
    "fabricDescription" TEXT,
    "fabricImageUrl" TEXT,
    "fabricReceived" BOOLEAN NOT NULL DEFAULT false,
    "fabricReceivedAt" TIMESTAMP(3),
    "expectedDeliveryDate" TIMESTAMP(3),
    "actualDeliveryDate" TIMESTAMP(3),
    "pickupDate" TIMESTAMP(3),
    "deliveryProvider" TEXT,
    "trackingNumber" TEXT,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "priceOverrideReason" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "styleReferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable "payment_transactions"
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

-- CreateTable "notification_logs"
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

-- CreateTable "timeline_events"
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "designs_code_key" ON "designs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "measurements_userId_key" ON "measurements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_shortId_key" ON "bookings"("shortId");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_bookingId_key" ON "appointments"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_settingsId_dayOfWeek_key" ON "business_hours"("settingsId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_settingsId_holidayDate_key" ON "holidays"("settingsId", "holidayDate");

-- CreateIndex
CREATE UNIQUE INDEX "orders_shortId_key" ON "orders"("shortId");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "shop_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "shop_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
