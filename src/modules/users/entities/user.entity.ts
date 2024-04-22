import { Role } from 'src/modules/auth/interface/user.interface';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, length: 50 })
  firstName?: string;

  @Column({ nullable: true, length: 50 })
  lastName?: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  isActive?: boolean;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, type: 'enum' })
  role: Role;

  @Column({ nullable: true })
  refreshToken: string;
}
