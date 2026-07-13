import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: string) {
    return this.prismaService.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    const isDefault = dto.isDefault || false;

    if (isDefault) {
      await this.prismaService.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    } else {
      const count = await this.prismaService.address.count({ where: { userId } });
      if (count === 0) {
        dto.isDefault = true;
      }
    }

    return this.prismaService.address.create({
      data: {
        userId,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }

    if (dto.isDefault) {
      await this.prismaService.address.updateMany({
        where: { userId, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prismaService.address.update({
      where: { id: addressId },
      data: {
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        isDefault: dto.isDefault,
      },
    });
  }

  async delete(userId: string, addressId: string) {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }

    await this.prismaService.address.delete({
      where: { id: addressId },
    });

    if (address.isDefault) {
      const nextAddress = await this.prismaService.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (nextAddress) {
        await this.prismaService.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }

  async setDefault(userId: string, addressId: string) {
    const address = await this.prismaService.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }

    await this.prismaService.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return this.prismaService.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
