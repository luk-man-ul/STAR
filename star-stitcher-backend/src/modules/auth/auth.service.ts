import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          name: dto.name,
          phone: dto.phone,
        },
      },
    });

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'Failed to sign up user in Supabase');
    }

    // Double-check if the profile already exists in PostgreSQL
    let user = await this.prismaService.user.findUnique({
      where: { id: data.user.id },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          id: data.user.id,
          email: dto.email,
          name: dto.name,
          phone: dto.phone,
          role: Role.CUSTOMER,
        },
      });
    }

    return {
      user,
      session: data.session,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException(error?.message || 'Invalid email or password');
    }

    const profile = await this.prismaService.user.findUnique({
      where: { id: data.user.id },
    });

    return {
      user: profile || { id: data.user.id, email: data.user.email, role: Role.CUSTOMER },
      session: data.session,
    };
  }

  async logout() {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) {
      throw new BadRequestException(error.message);
    }
    return { message: 'Logged out successfully' };
  }

  async refresh(dto: RefreshDto) {
    const { data, error } = await this.supabaseService.client.auth.refreshSession({
      refresh_token: dto.refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid refresh token');
    }

    return {
      session: data.session,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { error } = await this.supabaseService.client.auth.resetPasswordForEmail(dto.email);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { data: sessionData, error: sessionError } = await this.supabaseService.client.auth.setSession({
      access_token: dto.token,
      refresh_token: '',
    });

    if (sessionError || !sessionData.user) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    const { error: updateError } = await this.supabaseService.client.auth.updateUser({
      password: dto.password,
    });

    if (updateError) {
      throw new BadRequestException(updateError.message);
    }

    return { message: 'Password updated successfully' };
  }

  async getMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }
    return user;
  }
}
