import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateDesignDto {
  @ApiProperty({ example: 'categoryId-uuid', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'Zari Bridal Blouse', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'BL-002', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ example: 'Beautiful gold hand embroidery', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://supabase.co/image.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 4500, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 14, required: false })
  @IsNumber()
  @IsOptional()
  estimatedDays?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
