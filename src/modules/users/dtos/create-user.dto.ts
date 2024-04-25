import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/modules/auth/interface/user.interface';

export class CreateUserDto {
  @ApiProperty({ example: 'username1', description: 'The firstName of user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'username1@gmail.com', description: 'Your email !' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'The password of user' })
  password?: string;

  @ApiProperty({ example: 'Phong', description: 'firstname of user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  firstName?: string;

  @ApiProperty({ example: 'Ngô', description: 'lastName of user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  lastName?: string;

  @ApiProperty({ enum: Role, description: 'User role', default: Role.User })
  role?: Role;

  image?: string;
  provider?: string;
  providerId?: string;
  refreshToken?: string;
  isActive?: boolean;
}
