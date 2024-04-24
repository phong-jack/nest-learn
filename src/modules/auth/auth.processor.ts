import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { SendMailDto } from '../mail/dtos/send-mail.dto';

@Processor('auth', {
  concurrency: 2,
})
export class AuthProcessor extends WorkerHost {
  constructor(private mailService: MailService) {
    super();
  }
  private logger = new Logger();
  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'send-mail':
        const sendMailData: SendMailDto = job.data as SendMailDto;
        return await this.sendMailJob(sendMailData);
      default:
        throw new Error('No job name match');
    }
  }

  async sendMailJob(sendMailDto: SendMailDto) {
    this.logger.log('Sending mail....');
    return await this.mailService.sendUserConfirmation(
      sendMailDto.user,
      sendMailDto.token,
    );
  }
}
