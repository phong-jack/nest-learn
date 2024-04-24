import { User } from 'src/modules/users/entities/user.entity';

export class SendMailDto {
  user: User;
  token: string;
}
