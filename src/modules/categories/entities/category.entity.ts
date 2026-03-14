import { CategorySection } from 'common/enums/category-section.enum';
import { CategoryType } from 'common/enums/category-type.enum';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({
    type: 'enum',
    enum: CategorySection,
  })
  section: CategorySection;

  @ManyToOne(() => User, { nullable: true }) // null = categoria global | userId = categoría creada por usuario
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
