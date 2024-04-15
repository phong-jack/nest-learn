import { Repository } from 'typeorm';
import { User } from './src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsersDto } from './src/modules/users/controllers/dtos/CreateUser.dto';
import { UpdateUsersDto } from './src/modules/users/controllers/dtos/UpdateUser.dto';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  public async store(user: CreateUsersDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  public async updateOne(
    id: number,
    updateUserDto: UpdateUsersDto,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findBy({ id });
    if (!user) return undefined;
    await this.userRepository.save({
      id: id,
      ...updateUserDto,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async addAvatar(id: number, image: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) return undefined;
    await this.userRepository.update(id, { image: image });
    return await this.findById(id);
  }
}
