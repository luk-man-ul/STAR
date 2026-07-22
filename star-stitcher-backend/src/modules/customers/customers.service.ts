import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(search?: string) {
    const where: any = { role: Role.CUSTOMER };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prismaService.user.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getOne(id: string) {
    const customer = await this.prismaService.user.findFirst({
      where: { id, role: Role.CUSTOMER },
      include: {
        addresses: true,
        measurements: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    return customer;
  }

  async getOrders(id: string) {
    await this.getOne(id);
    return this.prismaService.order.findMany({
      where: { customerId: id },
      include: {
        design: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookings(id: string) {
    await this.getOne(id);
    return this.prismaService.booking.findMany({
      where: { customerId: id },
      include: {
        design: true,
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMeasurements(id: string) {
    await this.getOne(id);
    return this.prismaService.measurement.findMany({
      where: { userId: id },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
  }
}
