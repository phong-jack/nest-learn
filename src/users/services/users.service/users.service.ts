import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUsersDto } from 'src/users/controllers/dtos/CreateUser.dto';
import { UpdateUsersDto } from 'src/users/controllers/dtos/UpdateUser.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      if (users?.length === 0) {
        throw new Error('No record found!');
      }
      return users;
    } catch (error) {
      this.logger.log(`UserService:findAll : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const createUserDto: CreateUsersDto = plainToClass(CreateUsersDto, user);
      return this.userRepository.store(createUserDto);
    } catch (error) {
      this.logger.log(`UserService:create : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
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

  async update(id: number, user: User): Promise<User> {
    try {
      const updateUserDto = plainToClass(UpdateUsersDto, user);
      return await this.userRepository.updateOne(id, updateUserDto);
    } catch (error) {
      this.logger.log(`UserService:update : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async delete(id: number) {
    try {
      return await this.userRepository.destroy(id);
    } catch (error) {
      this.logger.log(`UserService:delete : ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }
}
