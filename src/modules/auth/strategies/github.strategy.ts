import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service/users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private userService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const { id, username, photos, provider } = profile; // id cua profile nay la id cua github => provider id
    const createUserDto: CreateUserDto = {
      username: username,
      provider: provider,
      providerId: id,
      email: 'example@email.com',
      image: photos[0].value,
    };
    console.log(photos);
    const user = await this.userService.findOrCreate(createUserDto);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
