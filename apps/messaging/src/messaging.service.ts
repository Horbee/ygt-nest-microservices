import { RmqService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

import { SendgridService } from './sendgrid.service';
import { WelcomeTemplate } from './templates';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(
    private readonly sendGrid: SendgridService,
    private readonly rmqService: RmqService,
  ) {}

  async sendWelcomeEmail(email: string, ctx: RmqContext) {
    const mail = {
      to: email,
      subject: "Welcome to You've got time",
      from: 'thehonormaster@gmail.com',
      html: WelcomeTemplate,
    };

    try {
      await this.sendGrid.send(mail);
      this.logger.log(`Welcome E-Mail sent to ${email}`);
      this.rmqService.ack(ctx);
    } catch (error) {
      this.logger.error(`Unable to send welcome E-Mail to ${email}`);
      this.logger.error(error);
    }
  }
}
