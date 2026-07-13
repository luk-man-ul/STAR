import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';
import * as Supabase from '@supabase/supabase-js';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new tailoring booking (Customer only)' })
  @ApiResponse({ status: 201, description: 'Booking successfully submitted' })
  create(@GetUser() user: Supabase.User, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user.id, dto);
  }

  @Get('customer')
  @ApiOperation({ summary: 'Get current customer bookings' })
  @ApiResponse({ status: 200, description: 'Return customer bookings list' })
  getCustomerBookings(@GetUser() user: Supabase.User) {
    return this.bookingsService.getCustomerBookings(user.id);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'View booking queue (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return all bookings queue' })
  getAdminQueue() {
    return this.bookingsService.getAdminQueue();
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Approve a booking request (Owner only)' })
  @ApiResponse({ status: 200, description: 'Booking approved' })
  approve(@Param('id') id: string) {
    return this.bookingsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reject a booking request (Owner only)' })
  @ApiResponse({ status: 200, description: 'Booking rejected' })
  reject(@Param('id') id: string) {
    return this.bookingsService.reject(id);
  }

  @Patch(':id/reschedule')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reschedule an appointment date (Owner only)' })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled' })
  reschedule(@Param('id') id: string, @Body() dto: RescheduleAppointmentDto) {
    return this.bookingsService.reschedule(id, dto);
  }

  @Patch(':id/arrive')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mark customer as arrived at the shop (Owner only)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  markCustomerArrived(@Param('id') id: string) {
    return this.bookingsService.markCustomerArrived(id);
  }

  @Post(':id/convert')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Convert booking into active order (Owner only)' })
  @ApiResponse({ status: 201, description: 'Stitching order generated' })
  convertToOrder(@Param('id') id: string) {
    return this.bookingsService.convertToOrder(id);
  }
}
