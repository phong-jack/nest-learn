import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'username1', description: 'Username of user' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  username: string;

  @ApiProperty({ example: '123456', description: 'password of user' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
