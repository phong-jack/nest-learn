import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  maxLength,
} from 'class-validator';

export class SignUpDto {
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

  @ApiProperty({ example: 'Phong', description: 'firstname of user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  firstName: string;

  @ApiProperty({ example: 'Ngô', description: 'lastName of user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  lastName: string;
}
