import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(includeArchived = false) {
    return this.prismaService.category.findMany({
      where: includeArchived ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prismaService.category.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.prismaService.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.getOne(id);

    if (dto.name) {
      const existing = await this.prismaService.category.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    return this.prismaService.category.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
      },
    });
  }

  async archive(id: string) {
    await this.getOne(id);
    return this.prismaService.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
