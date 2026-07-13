import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveMeasurementDto } from './dto/save-measurement.dto';
import { MeasurementSource } from '@prisma/client';

@Injectable()
export class MeasurementsService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(userId: string) {
    return this.prismaService.measurement.findUnique({
      where: { userId },
    });
  }

  async save(userId: string, dto: SaveMeasurementDto) {
    const existing = await this.prismaService.measurement.findUnique({
      where: { userId },
    });

    if (existing) {
      return this.prismaService.measurement.update({
        where: { userId },
        data: {
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
          version: existing.version + 1,
          measurementSource: MeasurementSource.ONLINE,
          verifiedByShop: false,
          verifiedAt: null,
        },
      });
    } else {
      return this.prismaService.measurement.create({
        data: {
          userId,
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
    }
  }
}
