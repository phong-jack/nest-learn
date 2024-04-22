import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response, query } from 'express';
import { SuccessResponse } from 'src/core/http.success.response';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/SignIn.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../users/controllers/dtos/create-user.dto';
import { UpdateUserDto } from '../users/controllers/dtos/update-user.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('login')
  // async signIn(@Res() res: Response, @Body() signInDto: SignInDto) {
  //   new SuccessResponse({
  //     message: 'Login success!',
  //     statusCode: HttpStatus.OK,
  //     data: await this.authService.signIn(
  //       signInDto.username,
  //       signInDto.password,
  //     ),
  //   }).send(res);
  // }

  // @Post('register')
  // async signUp(@Res() res: Response, @Body() signUpDto: SignUpDto) {
  //   new SuccessResponse({
  //     message: 'Register success!',
  //     statusCode: HttpStatus.OK,
  //     data: await this.authService.signUp(
  //       signUpDto.username,
  //       signUpDto.password,
  //       signUpDto.firstName,
  //       signUpDto.lastName,
  //     ),
  //   }).send(res);
  // }

  @Get('profile')
  getProfile(@Req() req) {
    console.log('check user:: ', req.user);
    return req.user;
  }

  //sign up v2 Là sign up của access + refresh token
  @Post('signup')
  signupV2(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpV2(createUserDto);
  }

  @Post('signin')
  signInV2(@Body() data: SignInDto) {
    return this.authService.signInV2(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logoutV2(@Req() req: Request, @Res() res: Response) {
    new SuccessResponse({
      message: 'logout success!',
      statusCode: HttpStatus.OK,
      data: this.authService.logoutV2(req.user['sub']),
    }).send(res);
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('active')
  async activeUser(@Query() query: any) {
    const token = decodeURIComponent(query.token);
    if (!token) throw new ForbiddenException('Token is none!');
    const decodedUser = await this.authService.decodeToken(token);
    await this.authService.activeUser(decodedUser.sub);
    return 'Active ok!';
  }
}
