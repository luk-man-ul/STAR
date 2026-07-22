import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength, Matches } from 'class-validator';
import { SaveMeasurementDto } from './save-measurement.dto';

export class UpdateMeasurementDto extends SaveMeasurementDto {
  @ApiProperty({ example: 'My Measurements', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Profile name cannot exceed 50 characters' })
  @Matches(/\S+/, { message: 'Profile name cannot be empty or whitespace-only' })
  profileName?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
