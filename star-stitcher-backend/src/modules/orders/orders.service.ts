import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { shortId: { contains: params.search, mode: 'insensitive' } },
        { customer: { name: { contains: params.search, mode: 'insensitive' } } },
        { customer: { phone: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prismaService.order.count({ where }),
      this.prismaService.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          design: { include: { category: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOne(id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        customer: {
          include: { addresses: true, measurements: true },
        },
        design: {
          include: { category: true },
        },
        shippingAddress: true,
        transactions: true,
        timelineEvents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      throw new NotFoundException('Tailoring order not found');
    }

    return order;
  }

  async create(dto: CreateOrderDto) {
    const customer = await this.prismaService.user.findUnique({
      where: { id: dto.customerId },
      include: { measurements: true },
    });
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const design = await this.prismaService.design.findUnique({
      where: { id: dto.designId },
    });
    if (!design) {
      throw new NotFoundException('Lookbook design not found');
    }

    const shortId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prismaService.$transaction(async (tx) => {
      const defaultMeasurement = customer.measurements.find((m) => m.isDefault) || customer.measurements[0];
      const order = await tx.order.create({
        data: {
          shortId,
          customerId: dto.customerId,
          designId: dto.designId,
          status: OrderStatus.BOOKED,
          appointmentDate: new Date(dto.appointmentDate),
          deliveryType: dto.deliveryType,
          addressId: dto.addressId,
          specialInstructions: dto.specialInstructions,
          isUrgent: dto.isUrgent ?? false,
          rushFee: dto.rushFee ?? 0.0,
          fabricSource: dto.fabricSource,
          fabricDescription: dto.fabricDescription,
          fabricImageUrl: dto.fabricImageUrl,
          expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : null,
          finalPrice: dto.finalPrice,
          priceOverrideReason: dto.priceOverrideReason,
          paymentStatus: PaymentStatus.UNPAID,
          paidAmount: 0.0,
          remainingAmount: dto.finalPrice,
          measurementSnapshot: (defaultMeasurement as any) || {},
        },
      });

      await tx.timelineEvent.create({
        data: {
          orderId: order.id,
          status: OrderStatus.BOOKED,
          notes: 'Manual order created by shop admin',
        },
      });

      return order;
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.getOne(id);

    return this.prismaService.order.update({
      where: { id },
      data: {
        appointmentDate: dto.appointmentDate ? new Date(dto.appointmentDate) : undefined,
        deliveryType: dto.deliveryType,
        addressId: dto.addressId,
        specialInstructions: dto.specialInstructions,
        isUrgent: dto.isUrgent,
        rushFee: dto.rushFee,
        fabricSource: dto.fabricSource,
        fabricDescription: dto.fabricDescription,
        fabricImageUrl: dto.fabricImageUrl,
        expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
        finalPrice: dto.finalPrice,
        priceOverrideReason: dto.priceOverrideReason,
        remainingAmount: dto.finalPrice ? dto.finalPrice - order.paidAmount : undefined,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.getOne(id);

    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status: dto.status },
      });

      await tx.timelineEvent.create({
        data: {
          orderId: id,
          status: dto.status,
          notes: dto.notes || `Order status updated to ${dto.status}`,
        },
      });

      return order;
    });
  }

  async recordPayment(id: string, dto: RecordPaymentDto) {
    const order = await this.getOne(id);

    const totalPaid = order.paidAmount + dto.amount;
    if (totalPaid > order.finalPrice) {
      throw new BadRequestException('Total payments recorded cannot exceed order final price');
    }

    let paymentStatus: PaymentStatus = PaymentStatus.UNPAID;
    if (totalPaid >= order.finalPrice) {
      paymentStatus = PaymentStatus.PAID;
    } else if (totalPaid > 0) {
      paymentStatus = PaymentStatus.PARTIALLY_PAID;
    }

    const remainingAmount = order.finalPrice - totalPaid;

    return this.prismaService.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          orderId: id,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          transactionReference: dto.transactionReference,
          notes: dto.notes,
        },
      });

      return tx.order.update({
        where: { id },
        data: {
          paidAmount: totalPaid,
          remainingAmount,
          paymentStatus,
        },
        include: { transactions: true },
      });
    });
  }

  async getByCustomerId(customerId: string) {
    return this.prismaService.order.findMany({
      where: { customerId },
      include: {
        design: { include: { category: true } },
        timelineEvents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByStatus(status: OrderStatus) {
    return this.prismaService.order.findMany({
      where: { status },
      include: {
        customer: true,
        design: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
