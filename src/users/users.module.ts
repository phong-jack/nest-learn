import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service/users.service';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
