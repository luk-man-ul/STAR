import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: OrderStatus.MEASURED, enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;

  @ApiProperty({ example: 'Measurements verified by tailor', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
