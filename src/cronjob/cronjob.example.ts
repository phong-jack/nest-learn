import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'notifications',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  handleCron() {
    this.logger.debug('Called when the current second is 10');
  }
}
