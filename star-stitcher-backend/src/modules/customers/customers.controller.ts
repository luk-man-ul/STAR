import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List and search customers (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return customers list' })
  getAll(@Query('search') search?: string) {
    return this.customersService.getAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer profile details (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return customer details' })
  getOne(@Param('id') id: string) {
    return this.customersService.getOne(id);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Get orders list for customer (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return orders' })
  getOrders(@Param('id') id: string) {
    return this.customersService.getOrders(id);
  }

  @Get(':id/bookings')
  @ApiOperation({ summary: 'Get bookings queue for customer (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return bookings' })
  getBookings(@Param('id') id: string) {
    return this.customersService.getBookings(id);
  }

  @Get(':id/measurements')
  @ApiOperation({ summary: 'Get measurements for customer (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return measurements' })
  getMeasurements(@Param('id') id: string) {
    return this.customersService.getMeasurements(id);
  }
}
