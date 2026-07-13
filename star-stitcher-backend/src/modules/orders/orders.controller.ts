import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all orders with pagination, search and filter (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return orders list' })
  getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.getAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return order details' })
  getOne(@Param('id') id: string) {
    return this.ordersService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tailoring order manually (Owner only)' })
  @ApiResponse({ status: 201, description: 'Order created' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order information manually (Owner only)' })
  @ApiResponse({ status: 200, description: 'Order updated' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition order status in workflow (Owner only)' })
  @ApiResponse({ status: 200, description: 'Order status updated, timeline event appended' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/payment')
  @ApiOperation({ summary: 'Record manual cash/UPI/card payment transaction (Owner only)' })
  @ApiResponse({ status: 200, description: 'Payment recorded, balance updated' })
  recordPayment(@Param('id') id: string, @Body() dto: RecordPaymentDto) {
    return this.ordersService.recordPayment(id, dto);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get orders list for specific customer (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return customer orders list' })
  getByCustomerId(@Param('customerId') customerId: string) {
    return this.ordersService.getByCustomerId(customerId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get orders by workflow status stage (Owner only)' })
  @ApiResponse({ status: 200, description: 'Return filtered status orders' })
  getByStatus(@Param('status') status: OrderStatus) {
    return this.ordersService.getByStatus(status);
  }
}
