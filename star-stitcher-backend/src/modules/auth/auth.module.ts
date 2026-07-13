import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from './supabase.service';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, RolesGuard],
  exports: [AuthService, SupabaseService, RolesGuard],
})
export class AuthModule {}
