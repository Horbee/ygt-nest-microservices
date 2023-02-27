import * as Joi from 'joi';

import { PrismaModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_RT_SECRET: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        ALLOWED_ORIGINS: Joi.string().required(),
        AZURE_CLIENT_ID: Joi.string().optional(),
        AZURE_TENANT_ID: Joi.string().optional(),
      }),
      envFilePath: './apps/authentication/.env',
    }),
    UserModule,
    AuthModule,
    PrismaModule,
  ],
})
export class AuthenticationModule {}
