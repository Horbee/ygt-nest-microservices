import { catchError, Observable, tap } from 'rxjs';

import {
  CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';

import { Messages, Services } from '../../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(Services.AUTH) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.getToken(context);

    return this.authClient
      .send(Messages.VALIDATE_USER, { Authentication: token })
      .pipe(
        tap((res) => {
          this.addUser(res, context);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }

  private getToken(context: ExecutionContext) {
    let token: string;

    if (context.getType() === 'rpc') {
      token = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      token = context
        .switchToHttp()
        .getRequest()
        .headers.authorization?.replace('Bearer ', '');
    }

    if (!token)
      throw new UnauthorizedException('No authentication token was found!');

    return token;
  }

  private addUser(user: User, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
