import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserService } from '../user.service';

@Injectable()
export class IsIdentifierTaken implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const { identifier } = req.body;

    const user = await this.userService.findOne(identifier);

    if (user) throw new BadRequestException('Identifier is already taken');

    return true;
  }
}
