import { Attachment } from '@prisma/client';

import { AttachmentDto } from '../dto';

export function mapToAttachmentDto(attachment: Attachment): AttachmentDto {
  return { ...attachment };
}
