import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'username1', description: 'The firstName of user' })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'username1@gmail.com',
    description: 'The email of user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'The password of user' })
  password: string;

  refreshToken?: string;
}
