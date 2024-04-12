import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsersDto {
  @ApiProperty({ example: 'Ngô', description: 'The firstName of user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Phong', description: 'The lastName of user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  isActive?: boolean;
}
