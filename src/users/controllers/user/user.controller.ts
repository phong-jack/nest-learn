import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/services/users.service/users.service';
import { Response as ResponseType } from 'src/utils/enums/response.enum';
import { UpdateUsersDto } from '../dtos/UpdateUser.dto';
import { CreateUsersDto } from '../dtos/CreateUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @ApiOperation({ summary: 'Create user' })
  public async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json({
        type: ResponseType.SUCCESS,
        message: 'Get list user success!',
        data: users || [],
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: 'Something went wrong, Please try again later',
        data: null,
      });
    }
  }

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.findById(id);
      return res.status(HttpStatus.CREATED).json({
        type: ResponseType.SUCCESS,
        message: 'Get user success!',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  @Post('create')
  public async create(
    @Res() res: Response,
    @Body() createUserDto: CreateUsersDto,
  ) {
    try {
      const user = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        type: ResponseType.SUCCESS,
        message: 'User has been created successfully!',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  @Patch('update/:id')
  public async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUsersDto,
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return res.status(HttpStatus.ACCEPTED).json({
        type: ResponseType.SUCCESS,
        message: 'User update oke!',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  @Delete('delete/:id')
  public async delete(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const user = await this.usersService.delete(id);
      console.log('check user delete ', user);
      return res.status(HttpStatus.ACCEPTED).json({
        type: ResponseType.SUCCESS,
        message: 'Delete success!',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: error.message,
        data: null,
      });
    }
  }
}
