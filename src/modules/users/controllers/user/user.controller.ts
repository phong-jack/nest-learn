import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Response as ResponseType } from 'src/utils/enums/response.enum';
import { UpdateUsersDto } from '../dtos/UpdateUser.dto';
import { CreateUsersDto } from '../dtos/CreateUser.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import LocalFilesInterceptor from 'src/interceptors/localFile.interceptor';
import { UsersService } from '../../services/users.service/users.service';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { SuccessResponse } from 'src/core/http.success.response';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Get list user' })
  public async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();
    new SuccessResponse({
      message: 'Get list user success!',
      data: users,
    }).send(res);
  }

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.findById(id);
      new SuccessResponse({
        message: 'Get  user success!',
        data: user,
      }).send(res);
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
      throw new BadRequestException('kakfas');
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

  //upload and image for one user into cloudinary
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = await this.cloudinaryService.uploadFile(file);
    return this.usersService.addAvatarToCloud(id, response);
  }

  //upload and image for one user into localstore
  @Post('avatar/:id')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
    }),
  )
  async addAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(id, file.path);
  }
}
