import { RmqService, Services } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(Services.AUTH, true));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS'),
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
