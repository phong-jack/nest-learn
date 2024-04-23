import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserCreatedListener {
  constructor(private mailService: MailService) {}

  @OnEvent('user.create', { async: true })
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    console.log('Chạy');
    await this.mailService.sendUserConfirmation(event.user, event.token);
  }
}
