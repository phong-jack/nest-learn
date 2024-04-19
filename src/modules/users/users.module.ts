import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service/users.service';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRepository } from './repositories/user.repository';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthModule } from '../auth/auth.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRepository]),
    CloudinaryModule,
    CaslModule,
  ],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
