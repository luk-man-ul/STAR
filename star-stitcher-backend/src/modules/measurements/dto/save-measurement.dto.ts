import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class SaveMeasurementDto {
  @ApiProperty({ example: 34.5, required: false })
  @IsNumber()
  @IsOptional()
  bust?: number;

  @ApiProperty({ example: 28.0, required: false })
  @IsNumber()
  @IsOptional()
  underBust?: number;

  @ApiProperty({ example: 30.0, required: false })
  @IsNumber()
  @IsOptional()
  waist?: number;

  @ApiProperty({ example: 36.5, required: false })
  @IsNumber()
  @IsOptional()
  hip?: number;

  @ApiProperty({ example: 14.0, required: false })
  @IsNumber()
  @IsOptional()
  shoulder?: number;

  @ApiProperty({ example: 16.0, required: false })
  @IsNumber()
  @IsOptional()
  armHole?: number;

  @ApiProperty({ example: 12.0, required: false })
  @IsNumber()
  @IsOptional()
  sleeveLength?: number;

  @ApiProperty({ example: 10.5, required: false })
  @IsNumber()
  @IsOptional()
  sleeveRound?: number;

  @ApiProperty({ example: 7.0, required: false })
  @IsNumber()
  @IsOptional()
  frontNeckDepth?: number;

  @ApiProperty({ example: 8.0, required: false })
  @IsNumber()
  @IsOptional()
  backNeckDepth?: number;

  @ApiProperty({ example: 38.0, required: false, description: 'Maps to top/total length' })
  @IsNumber()
  @IsOptional()
  totalLength?: number;

  @ApiProperty({ example: 40.0, required: false, description: 'Maps to bottom width/opening or custom height' })
  @IsNumber()
  @IsOptional()
  bottomRound?: number;

  @ApiProperty({ example: { pantsLength: 39 }, required: false })
  @IsObject()
  @IsOptional()
  additionalMeasurements?: Record<string, any>;

  @ApiProperty({ example: 'Client wants loose fittings around waist.', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
