import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { TransactionOccurrence } from 'common/enums/transaction-occurrence.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionOccurrence,
    default: TransactionOccurrence.ONCE,
  })
  occurrence: TransactionOccurrence;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  createdAt: Date;
}
