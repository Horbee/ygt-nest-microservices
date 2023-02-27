import * as Joi from 'joi';

import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SEND_GRID_KEY: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
      envFilePath: './apps/messaging/.env',
    }),
    RmqModule,
  ],
  controllers: [MessagingController],
  providers: [MessagingService, SendgridService],
})
export class MessagingModule {}
