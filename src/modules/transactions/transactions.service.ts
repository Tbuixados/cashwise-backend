import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto, user: User) {
    const transaction = this.transactionRepository.create({
      amount: dto.amount,
      description: dto.description,
      occurrence: dto.occurrence,
      user: user,
      category: { id: dto.categoryId } as Category,
      paymentMethod: { id: dto.paymentMethodId } as PaymentMethod,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAll(user: User) {
    return this.transactionRepository.find({
      where: { user: { id: user.id } },
      relations: ['category', 'paymentMethod'],
    });
  }
}
