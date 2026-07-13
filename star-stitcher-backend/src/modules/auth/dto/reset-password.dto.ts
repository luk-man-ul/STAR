import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'your-received-reset-token-here' })
  @IsString()
  token!: string;
}
