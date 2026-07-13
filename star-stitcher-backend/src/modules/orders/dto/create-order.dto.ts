import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { DeliveryType, FabricSource } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ example: 'customerId-uuid' })
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ example: 'designId-uuid' })
  @IsString()
  @IsNotEmpty()
  designId!: string;

  @ApiProperty({ example: '2026-07-15T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate!: string;

  @ApiProperty({ example: DeliveryType.PICKUP, enum: DeliveryType })
  @IsEnum(DeliveryType)
  deliveryType!: DeliveryType;

  @ApiProperty({ example: 'addressId-uuid', required: false })
  @IsString()
  @IsOptional()
  addressId?: string;

  @ApiProperty({ example: 'Double stitches on neck', required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  rushFee?: number;

  @ApiProperty({ example: FabricSource.CUSTOMER_PROVIDED, enum: FabricSource })
  @IsEnum(FabricSource)
  fabricSource!: FabricSource;

  @ApiProperty({ example: '2.5 meters silk fabric', required: false })
  @IsString()
  @IsOptional()
  fabricDescription?: string;

  @ApiProperty({ example: 'https://supabase.co/fabric.jpg', required: false })
  @IsString()
  @IsOptional()
  fabricImageUrl?: string;

  @ApiProperty({ example: '2026-07-25T18:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  expectedDeliveryDate?: string;

  @ApiProperty({ example: 4500 })
  @IsNumber()
  finalPrice!: number;

  @ApiProperty({ example: 'Price discount offered', required: false })
  @IsString()
  @IsOptional()
  priceOverrideReason?: string;
}
