import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2026-07-16T15:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate!: string;
}
