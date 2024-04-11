import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { Response } from 'express';
import { CreateUserDto } from './dtos/createUserDto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    try {
      return await this.userService.getUsersWithFullName();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  findOne(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  remove(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post('')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
