import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/services/users.service/users.service';
import { UnauthorizedException } from 'src/core/http.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user?.password !== password) {
      throw new UnauthorizedException('Wrong password!');
    }
    const payload = { sub: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const user = await this.usersService.createNewUser(
      username,
      password,
      firstName,
      lastName,
    );
    return user;
  }
}
