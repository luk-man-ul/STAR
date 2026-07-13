import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@Injectable()
export class DesignsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    featured?: boolean;
    includeArchived?: boolean;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { code: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.featured !== undefined) {
      where.featured = params.featured;
    }

    if (!params.includeArchived) {
      where.isActive = true;
    }

    const [total, data] = await Promise.all([
      this.prismaService.design.count({ where }),
      this.prismaService.design.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        include: { category: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOne(id: string) {
    const design = await this.prismaService.design.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!design) {
      throw new NotFoundException('Design lookbook item not found');
    }
    return design;
  }

  async create(dto: CreateDesignDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Target category not found');
    }

    const existing = await this.prismaService.design.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('Design with this reference code already exists');
    }

    return this.prismaService.design.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        imageUrl: dto.imageUrl,
        price: dto.price,
        estimatedDays: dto.estimatedDays,
        featured: dto.featured ?? false,
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateDesignDto) {
    await this.getOne(id);

    if (dto.categoryId) {
      const category = await this.prismaService.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Target category not found');
      }
    }

    if (dto.code) {
      const existing = await this.prismaService.design.findFirst({
        where: { code: dto.code, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Design with this reference code already exists');
      }
    }

    return this.prismaService.design.update({
      where: { id },
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        imageUrl: dto.imageUrl,
        price: dto.price,
        estimatedDays: dto.estimatedDays,
        featured: dto.featured,
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
      },
      include: { category: true },
    });
  }

  async archive(id: string) {
    await this.getOne(id);
    return this.prismaService.design.update({
      where: { id },
      data: { isActive: false },
      include: { category: true },
    });
  }

  async duplicate(id: string) {
    const original = await this.getOne(id);

    const duplicateCode = `${original.code}-copy-${Math.floor(100 + Math.random() * 900)}`;
    const duplicateName = `${original.name} (Copy)`;

    return this.prismaService.design.create({
      data: {
        categoryId: original.categoryId,
        name: duplicateName,
        code: duplicateCode,
        description: original.description,
        imageUrl: original.imageUrl,
        price: original.price,
        estimatedDays: original.estimatedDays,
        featured: original.featured,
        displayOrder: original.displayOrder,
        isActive: true,
      },
      include: { category: true },
    });
  }
}
