import { RmqService, Services } from '@app/common';
import { NestFactory } from '@nestjs/core';

import { MessagingModule } from './messaging.module';

async function bootstrap() {
  const app = await NestFactory.create(MessagingModule);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.MESSAGING));
  await app.startAllMicroservices();
}
bootstrap();
