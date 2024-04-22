import { User } from '../../users/entities/user.entity';

export class UserCreatedEvent {
  user: User;
  token: string;
  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }
}
