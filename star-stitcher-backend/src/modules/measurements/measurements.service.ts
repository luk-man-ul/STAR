import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { MeasurementSource } from '@prisma/client';

@Injectable()
export class MeasurementsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: string) {
    return this.prismaService.measurement.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  async getOne(userId: string, id: string) {
    const measurement = await this.prismaService.measurement.findUnique({
      where: { id },
    });

    if (!measurement) {
      throw new NotFoundException('Measurement profile not found');
    }

    if (measurement.userId !== userId) {
      throw new ForbiddenException('You do not own this measurement profile');
    }

    return measurement;
  }

  async create(userId: string, dto: CreateMeasurementDto) {
    const isDefault = dto.isDefault || false;

    return this.prismaService.$transaction(async (tx) => {
      if (isDefault) {
        await tx.measurement.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      } else {
        const count = await tx.measurement.count({
          where: { userId },
        });
        if (count === 0) {
          dto.isDefault = true;
        }
      }

      return tx.measurement.create({
        data: {
          userId,
          profileName: dto.profileName,
          isDefault: dto.isDefault ?? false,
          bust: dto.bust,
          underBust: dto.underBust,
          waist: dto.waist,
          hip: dto.hip,
          shoulder: dto.shoulder,
          armHole: dto.armHole,
          sleeveLength: dto.sleeveLength,
          sleeveRound: dto.sleeveRound,
          frontNeckDepth: dto.frontNeckDepth,
          backNeckDepth: dto.backNeckDepth,
          totalLength: dto.totalLength,
          bottomRound: dto.bottomRound,
          additionalMeasurements: dto.additionalMeasurements || undefined,
          notes: dto.notes,
          version: 1,
          measurementSource: MeasurementSource.ONLINE,
          verifiedByShop: false,
        },
      });
    });
  }

  async update(userId: string, id: string, dto: UpdateMeasurementDto) {
    const measurement = await this.getOne(userId, id);

    return this.prismaService.$transaction(async (tx) => {
      let nextIsDefault = dto.isDefault;

      if (dto.isDefault) {
        await tx.measurement.updateMany({
          where: { userId, NOT: { id } },
          data: { isDefault: false },
        });
      } else if (dto.isDefault === false && measurement.isDefault) {
        nextIsDefault = true;
      }

      return tx.measurement.update({
        where: { id },
        data: {
          profileName: dto.profileName,
          isDefault: nextIsDefault,
          bust: dto.bust,
          underBust: dto.underBust,
          waist: dto.waist,
          hip: dto.hip,
          shoulder: dto.shoulder,
          armHole: dto.armHole,
          sleeveLength: dto.sleeveLength,
          sleeveRound: dto.sleeveRound,
          frontNeckDepth: dto.frontNeckDepth,
          backNeckDepth: dto.backNeckDepth,
          totalLength: dto.totalLength,
          bottomRound: dto.bottomRound,
          additionalMeasurements: dto.additionalMeasurements || undefined,
          notes: dto.notes,
          version: measurement.version + 1,
          measurementSource: MeasurementSource.ONLINE,
          verifiedByShop: false,
          verifiedAt: null,
        },
      });
    });
  }

  async delete(userId: string, id: string) {
    const measurement = await this.getOne(userId, id);

    return this.prismaService.$transaction(async (tx) => {
      await tx.measurement.delete({
        where: { id },
      });

      if (measurement.isDefault) {
        const nextProfile = await tx.measurement.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
        });

        if (nextProfile) {
          await tx.measurement.update({
            where: { id: nextProfile.id },
            data: { isDefault: true },
          });
        }
      }

      return { message: 'Measurement profile deleted successfully' };
    });
  }

  async setDefault(userId: string, id: string) {
    await this.getOne(userId, id);

    return this.prismaService.$transaction(async (tx) => {
      await tx.measurement.updateMany({
        where: { userId },
        data: { isDefault: false },
      });

      return tx.measurement.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  }
}
