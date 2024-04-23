import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/services/users.service/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/controllers/dtos/create-user.dto';
import argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dtos/SignIn.dto';
import { MailService } from '../mail/mail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  // async signIn(signInDto: SignInDto) {
  //   const user = await this.usersService.findByUsername(signInDto.username);
  //   if (!user) {
  //     throw new UnauthorizedException('User not found!');
  //   }
  //   if (user?.password !== signInDto.password) {
  //     throw new UnauthorizedException('Wrong password!');
  //   }

  //   return {
  //     accessToken: await this.jwtService.signAsync(user),
  //     user,
  //   };
  // }

  // async signUp(
  //   username: string,
  //   password: string,
  //   firstName: string,
  //   lastName: string,
  // ) {
  //   const user = await this.usersService.createNewUser(
  //     username,
  //     password,
  //     firstName,
  //     lastName,
  //   );
  //   return user;
  // }

  //sign up v2 Là sign up của access + refresh token
  async signUpV2(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
      newUser.isActive,
    );
    const mailToken = await this.getMailToken(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    this.eventEmitter.emit(
      'user.create',
      new UserCreatedEvent(newUser, mailToken),
    );
    console.log('check event:: ', 'chay khong biet?');

    return {
      user: newUser,
      tokens,
    };
  }

  async signInV2(data: SignInDto) {
    const user = await this.usersService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist!');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect!');
    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.role,
      user.isActive,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      tokens,
      user,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Token not valid');
    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.role,
      user.isActive,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logoutV2(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(
    userId: number,
    username: string,
    role: string,
    isActive: boolean,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, role, isActive },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getMailToken(userId: number, username: string) {
    const mailToken = await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      { secret: 'mailsecret', expiresIn: '30s' },
    );

    return mailToken;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async activeUser(userId: number) {
    const userActive = await this.usersService.update(userId, {
      isActive: true,
    });
    return userActive;
  }

  async decodeToken(token: string) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Error decoding token');
    }
  }
}
