import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import * as Supabase from '@supabase/supabase-js';

@ApiTags('addresses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all saved addresses' })
  @ApiResponse({ status: 200, description: 'List of addresses returned' })
  getAll(@GetUser() user: Supabase.User) {
    return this.addressesService.getAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Save a new address' })
  @ApiResponse({ status: 201, description: 'Address saved successfully' })
  create(@GetUser() user: Supabase.User, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  update(
    @GetUser() user: Supabase.User,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.id, addressId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  delete(@GetUser() user: Supabase.User, @Param('id') addressId: string) {
    return this.addressesService.delete(user.id, addressId);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set an address as default' })
  @ApiResponse({ status: 200, description: 'Address marked as default' })
  setDefault(@GetUser() user: Supabase.User, @Param('id') addressId: string) {
    return this.addressesService.setDefault(user.id, addressId);
  }
}
