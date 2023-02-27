import { RmqModule, Services } from '@app/common';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    RmqModule.register({ name: Services.EVENT }),
    RmqModule.register({ name: Services.MESSAGING }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
