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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Response as ResponseType } from 'src/utils/enums/response.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import LocalFilesInterceptor from 'src/interceptors/localFile.interceptor';
import { UsersService } from '../../services/users.service/users.service';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { CustomResponeInterceptor } from '../../../../interceptors/customResponse.interceptor';
import { Role } from 'src/modules/auth/interface/user.interface';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { ApiCustomResponse } from 'src/core/apiResponse.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
} from 'src/modules/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/modules/casl/guards/policy.guard';
import { CheckPolicies } from 'src/modules/casl/decorator/casl.decorator';
import { Action } from 'src/modules/casl/constant/casl.constant';
import { User } from '../../entities/user.entity';
import { ActiveUserGuard } from 'src/modules/auth/guards/activedUser.guard';
import { ApplyCircuitBreaker } from 'src/interceptors/apply-circuit-breaker.interceptor';
import { RoleGuardMixin } from 'src/modules/auth/guards/role-mixin.guard';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get('')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all usersfd sucess!!!!',
  })
  @ApiOperation({ summary: 'Get list user' })
  // @Roles(Role.User)
  @ApiCustomResponse({
    message: 'Get user success!',
    statusCode: HttpStatus.OK,
  })
  // @UseGuards(RoleGuard)
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @UseGuards(RoleGuardMixin([Role.Admin]))
  @UseInterceptors(CustomResponeInterceptor)
  public async findAll() {
    return await this.usersService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find user success!',
  })
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiCustomResponse({
    message: 'Find user success!',
    statusCode: HttpStatus.OK,
  })
  // @UseGuards(RoleGuardMixin([Role.User]))
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @UseInterceptors(CustomResponeInterceptor)
  @Get(':id')
  public async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.findById(id);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Find user success!',
  })
  @ApiOperation({ summary: 'Create new user!' })
  @ApiCustomResponse({
    message: 'Create new user success!',
    statusCode: HttpStatus.CREATED,
  })
  @UseGuards(RoleGuardMixin([Role.Admin]))
  @UseInterceptors(CustomResponeInterceptor)
  @Post('create')
  public async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'update user info' })
  @ApiCustomResponse({
    message: 'User update oke!',
    statusCode: HttpStatus.OK,
  })
  @UseGuards(ActiveUserGuard)
  @UseInterceptors(CustomResponeInterceptor)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return user;
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
  @ApplyCircuitBreaker({
    successThreshold: 5,
    failureThreshold: 5,
    openToHalfOpenWaitTime: 60000,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
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
