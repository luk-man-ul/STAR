import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateDesignDto {
  @ApiProperty({ example: 'categoryId-uuid' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ example: 'Zari Bridal Blouse' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'BL-002' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Beautiful gold hand embroidery', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://supabase.co/image.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 4500 })
  @IsNumber()
  price!: number;

  @ApiProperty({ example: 14 })
  @IsNumber()
  estimatedDays!: number;

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
