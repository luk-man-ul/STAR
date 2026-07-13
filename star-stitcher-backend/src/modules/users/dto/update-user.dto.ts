import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Jane Smith', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://placeholder.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
