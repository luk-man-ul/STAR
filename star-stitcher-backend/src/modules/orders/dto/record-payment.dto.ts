import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class RecordPaymentDto {
  @ApiProperty({ example: 2000 })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ example: PaymentMethod.UPI, enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @ApiProperty({ example: 'TXN-98231', required: false })
  @IsString()
  @IsOptional()
  transactionReference?: string;

  @ApiProperty({ example: 'Advance payment collected', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
