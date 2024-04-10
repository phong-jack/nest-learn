import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ example: 'Ngô', description: 'The firstName of user' })
  @Column()
  firstName?: string;

  @ApiProperty({ example: 'Phong', description: 'The lastName of user' })
  @Column()
  lastName?: string;

  @Column({ default: true })
  isActive?: boolean;
}
