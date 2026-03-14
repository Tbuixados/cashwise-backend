import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users') //le dice a TypeOrm que esto es una tabla
export class User {
  @PrimaryGeneratedColumn('uuid') //genera automaticamente UUID
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' }) //crea columna
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn() //se llena automaticamente con now
  createdAt: Date;
}
