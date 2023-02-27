import { AuthModule } from '@app/common';
import { Module } from '@nestjs/common';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [AuthModule, CloudinaryModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
