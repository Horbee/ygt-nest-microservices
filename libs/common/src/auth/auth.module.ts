import { Module } from '@nestjs/common';

import { Services } from '../constants';
import { RmqModule } from '../rmq';

@Module({
  imports: [RmqModule.register({ name: Services.AUTH })],
  exports: [RmqModule],
})
export class AuthModule {}
