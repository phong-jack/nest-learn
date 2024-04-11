import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { UserService } from './services/user/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [UserModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserHttpModule {}
