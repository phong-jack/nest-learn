import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUsersDto } from '../../controllers/dtos/CreateUser.dto';
import { User } from '../../entities/user.entity';
import { UpdateUsersDto } from '../../controllers/dtos/UpdateUser.dto';
import { CloudinaryResponse } from 'src/modules/cloudinary/cloudinary-response';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll();
      if (users?.length === 0) {
        throw new Error('No record found!');
      }
      // throw new Error('chowi chieu');

      return users;
    } catch (error) {
      this.logger.log(`UserService:findAll : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async create(user: CreateUsersDto): Promise<User> {
    try {
      return this.userRepository.store(user);
    } catch (error) {
      this.logger.log(`UserService:create : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      console.log('Check: ', user.fullName);
      if (!user) {
        throw new Error('User not found!');
      }
      return user;
    } catch (error) {
      this.logger.log(
        `UserService:findById : ${JSON.stringify(error.message)}`,
      );
      throw new Error(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUsersDto): Promise<User> {
    try {
      return await this.userRepository.updateOne(id, updateUserDto);
    } catch (error) {
      this.logger.log(`UserService:update : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async delete(id: number) {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      this.logger.log(`UserService:delete : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async addAvatar(id: number, image: string) {
    try {
      const updateUser = await this.userRepository.addAvatar(id, image);
      if (!updateUser) {
        throw new HttpException('User not found!!', 400);
      }
      return updateUser;
    } catch (error) {
      this.logger.log(
        `UserService:addAvatar : ${JSON.stringify(error.message)}`,
      );
      throw new Error(error.message);
    }
  }
  async addAvatarToCloud(id: number, cloudinaryResponse: CloudinaryResponse) {
    try {
      const { url } = cloudinaryResponse;
      const updateUser = await this.userRepository.addAvatar(id, url);
      if (!updateUser) {
        throw new HttpException('User not found!!', 400);
      }
      return updateUser;
    } catch (error) {
      this.logger.log(
        `UserService:addAvatar : ${JSON.stringify(error.message)}`,
      );
      throw new Error(error.message);
    }
  }
}
