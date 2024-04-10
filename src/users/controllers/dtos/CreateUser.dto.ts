import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, isBoolean } from 'class-validator';

export class CreateUsersDto {
  readonly id?: number;

  @ApiProperty({ example: 'Ngô', description: 'The firstName of user' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsOptional()
  readonly isActive?: boolean;
}
