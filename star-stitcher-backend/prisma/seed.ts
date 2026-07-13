import { PrismaClient, Role, MeasurementSource, OrderStatus, PaymentStatus, DeliveryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean database
  await prisma.timelineEvent.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.design.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.measurement.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🗑️  Cleaned existing database records');

  // 2. Create Users (Owner & Customers)
  const owner = await prisma.user.create({
    data: {
      id: 'usr_owner_01',
      email: 'owner@starstitcher.com',
      name: 'Radhika Sharma',
      phone: '+919876543210',
      role: Role.ADMIN,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      id: 'usr_cust_01',
      email: 'priya@example.com',
      name: 'Priya Patel',
      phone: '+919895000111',
      role: Role.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      id: 'usr_cust_02',
      email: 'ananya@example.com',
      name: 'Ananya Rao',
      phone: '+919895000222',
      role: Role.CUSTOMER,
    },
  });

  console.log('👥 Created users (1 Owner, 2 Customers)');

  // 3. Create Addresses
  await prisma.address.create({
    data: {
      userId: customer1.id,
      addressLine1: '402, Lotus Residency',
      addressLine2: 'MG Road, Kengeri',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560060',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: customer1.id,
      addressLine1: 'Workplace Building B',
      addressLine2: 'Tech Park, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560066',
      isDefault: false,
    },
  });

  await prisma.address.create({
    data: {
      userId: customer2.id,
      addressLine1: '12, Rose Villa',
      addressLine2: 'Malleshwaram',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560003',
      isDefault: true,
    },
  });

  console.log('📍 Created customer shipping addresses');

  // 4. Create Measurements
  await prisma.measurement.create({
    data: {
      userId: customer1.id,
      measurementSource: MeasurementSource.ONLINE,
      verifiedByShop: false,
      notes: 'Initial self-submitted measurements for daily wear stitching.',
      version: 1,
      bust: 34.5,
      waist: 28.0,
      hip: 36.0,
      shoulder: 14.5,
      neck: 13.0,
      sleeveLength: 12.0,
      totalLength: 38.0,
    },
  });

  await prisma.measurement.create({
    data: {
      userId: customer2.id,
      measurementSource: MeasurementSource.SHOP,
      verifiedByShop: true,
      verifiedAt: new Date(),
      notes: 'Verified in-person at the shop for bridal outfit sizing.',
      version: 2,
      bust: 36.0,
      waist: 30.5,
      hip: 39.0,
      shoulder: 15.0,
      neck: 14.0,
      sleeveLength: 18.0,
      totalLength: 54.0,
    },
  });

  console.log('📏 Created customer measurements (1 online, 1 verified in-shop)');

  // 5. Create Categories
  const catBlouse = await prisma.category.create({
    data: { name: 'Blouse', description: 'Designer and traditional sarees blouses' },
  });
  const catKurti = await prisma.category.create({
    data: { name: 'Kurti', description: 'Daily wear and casual kurtis' },
  });
  const catLehenga = await prisma.category.create({
    data: { name: 'Lehenga', description: 'Exquisite bridal and event lehenga cholis' },
  });
  const catFrock = await prisma.category.create({
    data: { name: 'Frock', description: 'Custom western and designer frocks' },
  });
  const catUniform = await prisma.category.create({
    data: { name: 'Uniform', description: 'School and corporate uniforms' },
  });
  const catAlteration = await prisma.category.create({
    data: { name: 'Alteration', description: 'Fitting adjustments and custom repairs' },
  });

  console.log('🏷️  Created categories');

  // 6. Create Designs under Categories
  const design1 = await prisma.design.create({
    data: {
      categoryId: catBlouse.id,
      name: 'V-Neck Classic Blouse',
      code: 'BL-001',
      description: 'Sleek V-neck design with border lining.',
      price: 650.0,
      estimatedDays: 5,
      featured: true,
      displayOrder: 1,
    },
  });

  const design2 = await prisma.design.create({
    data: {
      categoryId: catBlouse.id,
      name: 'Heavy Zari Bridal Blouse',
      code: 'BL-002',
      description: 'Detailed hand embroidery zari work blouse for wedding sarees.',
      price: 4500.0,
      estimatedDays: 14,
      featured: true,
      displayOrder: 2,
    },
  });

  const design3 = await prisma.design.create({
    data: {
      categoryId: catKurti.id,
      name: 'A-Line Casual Kurti',
      code: 'KU-001',
      description: 'Comfortable everyday wear A-Line kurti with pockets.',
      price: 800.0,
      estimatedDays: 4,
      featured: false,
      displayOrder: 1,
    },
  });

  const design4 = await prisma.design.create({
    data: {
      categoryId: catLehenga.id,
      name: 'Royal Rajasthani Ghera Lehenga',
      code: 'LE-001',
      description: 'Full flare designer lehenga with intricate hand embroidery.',
      price: 12000.0,
      estimatedDays: 21,
      featured: true,
      displayOrder: 1,
    },
  });

  console.log('🎨 Created design catalog entries');

  // 7. Create Orders
  const order1 = await prisma.order.create({
    data: {
      shortId: 'SS-2026-1001',
      customerId: customer1.id,
      designId: design3.id,
      status: OrderStatus.BOOKED,
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      deliveryType: DeliveryType.DELIVERY,
      addressId: (await prisma.address.findFirst({ where: { userId: customer1.id, isDefault: true } }))?.id,
      specialInstructions: 'Add lining cloth to the sleeves.',
      expectedDeliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // in 6 days
      finalPrice: 800.0, // Match catalog price
      paymentStatus: PaymentStatus.UNPAID,
      paidAmount: 0.0,
      remainingAmount: 800.0,
      measurementSnapshot: {
        bust: 34.5,
        waist: 28.0,
        hip: 36.0,
        shoulder: 14.5,
        neck: 13.0,
        sleeveLength: 12.0,
        totalLength: 38.0,
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      shortId: 'SS-2026-1002',
      customerId: customer2.id,
      designId: design2.id,
      status: OrderStatus.STITCHING,
      appointmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      deliveryType: DeliveryType.PICKUP,
      specialInstructions: 'Deep back neck with tassel attachments.',
      expectedDeliveryDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // in 9 days
      finalPrice: 4200.0, // Owner overrode price from 4500 to 4200
      priceOverrideReason: 'Loyalty discount applied for regular customer.',
      paymentStatus: PaymentStatus.PARTIALLY_PAID,
      paidAmount: 2000.0,
      remainingAmount: 2200.0,
      measurementSnapshot: {
        bust: 36.0,
        waist: 30.5,
        hip: 39.0,
        shoulder: 15.0,
        neck: 14.0,
        sleeveLength: 18.0,
        totalLength: 54.0,
      },
    },
  });

  console.log('📦 Created customer orders (1 pending, 1 stitching with overridden price)');

  // 8. Create Timeline Events
  await prisma.timelineEvent.create({
    data: {
      orderId: order1.id,
      status: OrderStatus.BOOKED,
      notes: 'Customer submitted booking request online.',
    },
  });

  await prisma.timelineEvent.create({
    data: {
      orderId: order2.id,
      status: OrderStatus.BOOKED,
      notes: 'Order created at shop counter.',
    },
  });

  await prisma.timelineEvent.create({
    data: {
      orderId: order2.id,
      status: OrderStatus.MEASURED,
      notes: 'Measurements confirmed and advanced payment of Rs. 2000 received.',
    },
  });

  await prisma.timelineEvent.create({
    data: {
      orderId: order2.id,
      status: OrderStatus.STITCHING,
      notes: 'Fabric handed over to tailors. Stitching in progress.',
    },
  });

  console.log('⏱️  Created timeline event logs');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
