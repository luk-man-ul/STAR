import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MeasurementsService } from './measurements.service';
import { SaveMeasurementDto } from './dto/save-measurement.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import * as Supabase from '@supabase/supabase-js';

@ApiTags('measurements')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch user measurement profile details' })
  @ApiResponse({ status: 200, description: 'Measurements loaded successfully' })
  get(@GetUser() user: Supabase.User) {
    return this.measurementsService.get(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update user measurement profile' })
  @ApiResponse({ status: 200, description: 'Measurements saved successfully' })
  save(@GetUser() user: Supabase.User, @Body() dto: SaveMeasurementDto) {
    return this.measurementsService.save(user.id, dto);
  }
}
