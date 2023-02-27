import { PrismaService } from '@app/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AttachmentDto } from './dto';
import { mapToAttachmentDto } from './mapper';

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<AttachmentDto> {
    try {
      const data = await this.cloudinary.uploadImage(file);

      const attachment = await this.prisma.attachment.create({
        data: {
          public_id: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          resource_type: data.resource_type,
          url: data.url,
        },
      });

      this.logger.log(`Image file with id: ${attachment.id} uploaded`);

      return mapToAttachmentDto(attachment);
    } catch (err) {
      this.logger.error('Error while uploading image file');
      console.error(err);
      throw new BadRequestException('Error while uploading image file');
    }
  }

  async deleteImageByPublicId(public_id: string): Promise<AttachmentDto> {
    try {
      await this.cloudinary.deleteImage(public_id);

      const attachment = await this.prisma.attachment.delete({
        where: { public_id },
      });

      this.logger.log(`Image file with id: ${attachment.id} deleted`);

      return mapToAttachmentDto(attachment);
    } catch (err) {
      this.logger.error('Error while deleting image file');
      console.error(err);
      throw new BadRequestException('Error while deleting image file');
    }
  }
}
