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
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response, query } from 'express';
import { SuccessResponse } from 'src/core/http.success.response';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/SignIn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { ApplyCircuitBreaker } from 'src/interceptors/apply-circuit-breaker.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { GithubGuard } from './guards/github.guard';
import { User } from '../users/entities/user.entity';
import { ApiCustomResponse } from 'src/core/apiResponse.decorator';
import { CustomResponeInterceptor } from '../../interceptors/customResponse.interceptor';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
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
  @ApiCustomResponse({
    message: 'logout success!',
    statusCode: HttpStatus.OK,
  })
  @UseInterceptors(CustomResponeInterceptor)
  @Get('logout')
  logoutV2(@Req() req) {
    return this.authService.logoutV2(req.user['sub']);
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

  @Get('github')
  @UseGuards(GithubGuard)
  async githubAuth() {
    //github lam het khuc nay roi
  }

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as User;
    console.log(
      `${this.githubAuthCallback.name}(): req.user = ${JSON.stringify(user, null, 4)}`,
    );
    return await this.authService.loginGithub(user);
  }
}
