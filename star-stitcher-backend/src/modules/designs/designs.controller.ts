import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('designs')
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all lookbook designs with search, pagination, and filters' })
  @ApiResponse({ status: 200, description: 'Return list of designs' })
  getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('featured') featured?: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
    const showAll = includeArchived === 'true';
    return this.designsService.getAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      categoryId,
      featured: isFeatured,
      includeArchived: showAll,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get design details by ID' })
  @ApiResponse({ status: 200, description: 'Return design' })
  getOne(@Param('id') id: string) {
    return this.designsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new design (Owner only)' })
  @ApiResponse({ status: 201, description: 'Design successfully created' })
  create(@Body() dto: CreateDesignDto) {
    return this.designsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing design (Owner only)' })
  @ApiResponse({ status: 200, description: 'Design successfully updated' })
  update(@Param('id') id: string, @Body() dto: UpdateDesignDto) {
    return this.designsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive a design (Owner only)' })
  @ApiResponse({ status: 200, description: 'Design archived' })
  archive(@Param('id') id: string) {
    return this.designsService.archive(id);
  }

  @Post(':id/duplicate')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duplicate an existing design lookbook item (Owner only)' })
  @ApiResponse({ status: 201, description: 'Design duplicated successfully' })
  duplicate(@Param('id') id: string) {
    return this.designsService.duplicate(id);
  }
}
