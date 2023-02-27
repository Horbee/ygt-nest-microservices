import { RmqService, Services } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { EventSvcModule } from './event-svc.module';

async function bootstrap() {
  const app = await NestFactory.create(EventSvcModule);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.EVENT));

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS'),
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
