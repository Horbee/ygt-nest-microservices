import * as Joi from 'joi';

import { PrismaModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AttachmentModule } from './attachment/attachment.module';
import { AvailabilityModule } from './availability/availability.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        ALLOWED_ORIGINS: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
      envFilePath: './apps/event-svc/.env',
    }),
    PrismaModule,
    EventModule,
    AvailabilityModule,
    AttachmentModule,
  ],
})
export class EventSvcModule {}
