import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ example: '402, Lotus Residency', required: false })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiProperty({ example: 'MG Road', required: false })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: 'Bangalore', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Karnataka', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '560060', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
