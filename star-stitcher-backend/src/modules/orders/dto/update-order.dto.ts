import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { DeliveryType, FabricSource } from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({ example: '2026-07-15T10:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  appointmentDate?: string;

  @ApiProperty({ example: DeliveryType.PICKUP, enum: DeliveryType, required: false })
  @IsEnum(DeliveryType)
  @IsOptional()
  deliveryType?: DeliveryType;

  @ApiProperty({ example: 'addressId-uuid', required: false })
  @IsString()
  @IsOptional()
  addressId?: string;

  @ApiProperty({ example: 'Double stitches on neck', required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  rushFee?: number;

  @ApiProperty({ example: FabricSource.CUSTOMER_PROVIDED, enum: FabricSource, required: false })
  @IsEnum(FabricSource)
  @IsOptional()
  fabricSource?: FabricSource;

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

  @ApiProperty({ example: 4500, required: false })
  @IsNumber()
  @IsOptional()
  finalPrice?: number;

  @ApiProperty({ example: 'Price discount offered', required: false })
  @IsString()
  @IsOptional()
  priceOverrideReason?: string;
}
