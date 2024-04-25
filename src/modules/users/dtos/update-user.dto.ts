import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  refreshToken?: string | null;

  @ApiProperty({ readOnly: true }) // Set readOnly to true
  @IsOptional()
  password?: string;
}
