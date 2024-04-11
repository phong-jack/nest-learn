import { Entity, Column, PrimaryGeneratedColumn, VirtualColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @VirtualColumn({
    query(alias) {
      return `SELECT CONCAT(${alias}.firstName, ' ', ${alias}.lastName )`;
    },
  })
  fullName!: string;

  @Column({ default: true })
  isActive: boolean;
}
