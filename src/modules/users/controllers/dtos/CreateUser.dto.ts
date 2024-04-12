import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, isBoolean } from 'class-validator';

export class CreateUsersDto {
  readonly id?: number;

  @ApiProperty({ example: 'Ngô', description: 'The firstName of user' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Phong', description: 'The lastName of user' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsOptional()
  readonly isActive?: boolean;
}
