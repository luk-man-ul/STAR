import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
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
  @ApiOperation({ summary: 'List all measurement profiles' })
  @ApiResponse({ status: 200, description: 'Measurements loaded successfully' })
  getAll(@GetUser() user: Supabase.User) {
    return this.measurementsService.getAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific measurement profile' })
  @ApiResponse({ status: 200, description: 'Measurement profile loaded' })
  getOne(@GetUser() user: Supabase.User, @Param('id') id: string) {
    return this.measurementsService.getOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new measurement profile' })
  @ApiResponse({ status: 201, description: 'Measurement profile created successfully' })
  create(@GetUser() user: Supabase.User, @Body() dto: CreateMeasurementDto) {
    return this.measurementsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a measurement profile' })
  @ApiResponse({ status: 200, description: 'Measurement profile updated successfully' })
  update(
    @GetUser() user: Supabase.User,
    @Param('id') id: string,
    @Body() dto: UpdateMeasurementDto,
  ) {
    return this.measurementsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a measurement profile' })
  @ApiResponse({ status: 200, description: 'Measurement profile deleted successfully' })
  delete(@GetUser() user: Supabase.User, @Param('id') id: string) {
    return this.measurementsService.delete(user.id, id);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set a measurement profile as default' })
  @ApiResponse({ status: 200, description: 'Default profile updated' })
  setDefault(@GetUser() user: Supabase.User, @Param('id') id: string) {
    return this.measurementsService.setDefault(user.id, id);
  }
}
