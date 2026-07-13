import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MeasurementSource, DeliveryType } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ example: 'designId-uuid' })
  @IsString()
  @IsNotEmpty()
  designId!: string;

  @ApiProperty({ example: MeasurementSource.ONLINE, enum: MeasurementSource })
  @IsEnum(MeasurementSource)
  measurementMethod!: MeasurementSource;

  @ApiProperty({ example: DeliveryType.PICKUP, enum: DeliveryType })
  @IsEnum(DeliveryType)
  deliveryMethod!: DeliveryType;

  @ApiProperty({ example: 'addressId-uuid', required: false })
  @IsString()
  @IsOptional()
  addressId?: string;

  @ApiProperty({ example: 'Add gold buttons to sleeves', required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ example: '2026-07-15T14:30:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate!: string;
}
