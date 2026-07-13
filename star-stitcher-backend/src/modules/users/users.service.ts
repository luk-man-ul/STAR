import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const updateData: { name?: string; phone?: string } = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.phone) updateData.phone = dto.phone;

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      ...user,
      avatarUrl: dto.avatarUrl || null,
    };
  }
}
