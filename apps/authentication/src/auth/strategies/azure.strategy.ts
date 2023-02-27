import { BearerStrategy } from 'passport-azure-ad';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserService } from '../../user/user.service';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor(private userService: UserService, configService: ConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${configService.get(
        'AZURE_TENANT_ID',
      )}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get('AZURE_CLIENT_ID'),
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    // TODO
    // const user = await this.userService.findOne(payload.username);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
    return payload;
  }
}
