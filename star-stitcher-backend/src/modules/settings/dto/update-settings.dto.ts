import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsInt, IsEmail } from 'class-validator';
import { BusinessStatus } from '@prisma/client';

export class UpdateSettingsDto {
  @ApiProperty({ enum: BusinessStatus, required: false })
  @IsEnum(BusinessStatus)
  @IsOptional()
  status?: BusinessStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  aboutShop?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  googleMapsLink?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enableHomeDelivery?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  enablePickup?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  deliveryCharges?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  appointmentDuration?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  maxAppointmentsPerSlot?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  heroHeading?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  heroSubheading?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  websiteUrl?: string;
}
