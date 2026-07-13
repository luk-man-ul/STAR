import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../auth/supabase.service';

@Injectable()
export class StorageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadFile(file: Express.Multer.File, bucket = 'designs'): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uniqueId = Math.floor(100000 + Math.random() * 900000);
    const extension = file.originalname.split('.').pop();
    const filePath = `design_${uniqueId}_${Date.now()}.${extension}`;

    const { error } = await this.supabaseService.client.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException(`Failed to upload file to storage: ${error.message}`);
    }

    const { data: { publicUrl } } = this.supabaseService.client.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  }
}
