import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, BookingStatus, AppointmentStatus, Role } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSummary() {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todaysAppointments,
      pendingBookingsCount,
      inProgressOrdersCount,
      readyForPickupCount,
      deliveriesTodayCount,
      pendingPaymentsTotal,
      newCustomersCount,
    ] = await Promise.all([
      this.prismaService.appointment.findMany({
        where: {
          appointmentDate: {
            gte: startOfToday,
            lt: endOfToday,
          },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.RESCHEDULED] },
        },
        include: {
          booking: {
            include: { customer: true, design: true },
          },
        },
      }),

      this.prismaService.booking.count({
        where: { status: BookingStatus.PENDING },
      }),

      this.prismaService.order.count({
        where: {
          status: {
            in: [
              OrderStatus.BOOKED,
              OrderStatus.MEASUREMENT_PENDING,
              OrderStatus.MEASURED,
              OrderStatus.CUTTING,
              OrderStatus.STITCHING,
              OrderStatus.QUALITY_CHECK,
            ],
          },
        },
      }),

      this.prismaService.order.count({
        where: { status: OrderStatus.READY_FOR_PICKUP },
      }),

      this.prismaService.order.count({
        where: {
          OR: [
            { status: OrderStatus.OUT_FOR_DELIVERY },
            {
              expectedDeliveryDate: {
                gte: startOfToday,
                lt: endOfToday,
              },
            },
          ],
        },
      }),

      this.prismaService.order.aggregate({
        where: {
          remainingAmount: { gt: 0 },
        },
        _sum: {
          remainingAmount: true,
        },
        _count: {
          id: true,
        },
      }),

      this.prismaService.user.count({
        where: {
          role: Role.CUSTOMER,
          createdAt: { gte: firstDayOfMonth },
        },
      }),
    ]);

    return {
      todaysAppointments,
      pendingBookingsCount,
      inProgressOrdersCount,
      readyForPickupCount,
      deliveriesTodayCount,
      pendingPayments: {
        count: pendingPaymentsTotal._count.id || 0,
        amount: pendingPaymentsTotal._sum.remainingAmount || 0,
      },
      newCustomersCount,
    };
  }
}
