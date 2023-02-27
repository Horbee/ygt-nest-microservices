import { JwtAuthGuard } from '@app/common';
import {
  Controller, Delete, Param, Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AttachmentService } from './attachment.service';

import type { AttachmentDto } from './dto';
import type { PublicIdParams } from './params';

@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttachmentDto> {
    return this.attachmentService.uploadImage(file);
  }

  @Delete(':publicId')
  async deleteImageByPublicId(
    @Param() { publicId }: PublicIdParams,
  ): Promise<AttachmentDto> {
    return this.attachmentService.deleteImageByPublicId(publicId);
  }
}
