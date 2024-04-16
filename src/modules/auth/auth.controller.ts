import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SuccessResponse } from 'src/core/http.success.response';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/SignIn.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/SignUp.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Res() res: Response, @Body() signInDto: SignInDto) {
    new SuccessResponse({
      message: 'Login success!',
      statusCode: HttpStatus.OK,
      data: await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      ),
    }).send(res);
  }

  @Public()
  @Post('register')
  async signUp(@Res() res: Response, @Body() signUpDto: SignUpDto) {
    new SuccessResponse({
      message: 'Register success!',
      statusCode: HttpStatus.OK,
      data: await this.authService.signUp(
        signUpDto.username,
        signUpDto.password,
        signUpDto.firstName,
        signUpDto.lastName,
      ),
    }).send(res);
  }

  @Get('profile')
  getProfile() {
    console.log('check user:: ', req.user);
    return req.user;
  }
}
