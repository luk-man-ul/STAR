import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get shop configuration settings (Public)' })
  @ApiResponse({ status: 200, description: 'Return settings record' })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shop configuration (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }

  @Patch('hours')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business hours (Admin only)' })
  @ApiResponse({ status: 200, description: 'Business hours updated' })
  updateBusinessHours(@Body() hours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]) {
    return this.settingsService.updateBusinessHours(hours);
  }

  @Post('holidays')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update holiday closure (Admin only)' })
  @ApiResponse({ status: 201, description: 'Holiday saved' })
  createHoliday(@Body() dto: { holidayDate: string; name: string; description?: string }) {
    return this.settingsService.createHoliday(dto.holidayDate, dto.name, dto.description);
  }

  @Delete('holidays/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a holiday closure (Admin only)' })
  @ApiResponse({ status: 200, description: 'Holiday deleted' })
  deleteHoliday(@Param('id') id: string) {
    return this.settingsService.deleteHoliday(id);
  }
}
