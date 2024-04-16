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

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT (${alias}.firstName, ' ', ${alias}.lastName) AS fullName`,
  })
  fullName: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive?: boolean;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;
}
