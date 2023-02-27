import { Events } from '@app/common';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { MessagingService } from './messaging.service';

@Controller()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @EventPattern(Events.USER_CREATED)
  async sendWelcomeEmail(@Payload() email: string, @Ctx() ctx: RmqContext) {
    await this.messagingService.sendWelcomeEmail(email, ctx);
  }
}
