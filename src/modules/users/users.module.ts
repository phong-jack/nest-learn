import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service/users.service';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRepository } from './repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRepository]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [
    UsersService,
    UserRepository,
    CloudinaryService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
