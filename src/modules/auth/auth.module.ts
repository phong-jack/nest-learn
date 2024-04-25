import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { MailModule } from '../mail/mail.module';
import { UserCreatedListener } from './listeners/user-created.listener';
import { BullModule } from '@nestjs/bullmq';
import { AuthProcessor } from './auth.processor';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    MailModule,
    BullModule.registerQueue({ name: 'auth' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
    UserCreatedListener,
    AuthProcessor,
    GithubStrategy,
  ],
})
export class AuthModule {}
