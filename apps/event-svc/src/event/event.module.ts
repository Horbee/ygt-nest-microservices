import { AuthModule } from '@app/common';
import { Module } from '@nestjs/common';

import { AttachmentModule } from '../attachment/attachment.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [AuthModule, AttachmentModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
