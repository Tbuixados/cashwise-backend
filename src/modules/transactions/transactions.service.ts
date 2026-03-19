import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Between, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { CategoryType } from 'common/enums/category-type.enum';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

type StatsRaw = {
  income: string | null;
  expense: string | null;
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(dto: CreateTransactionDto, user: User) {
    //validar category
    const category = await this.categoryRepository.findOne({
      where: [
        { id: dto.categoryId, user: { id: user.id } },
        { id: dto.categoryId, user: IsNull() },
      ],
    });

    if (!category) {
      throw new ForbiddenException('Invalid category');
    }

    //validar paymentMethod
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: [
        { id: dto.paymentMethodId, user: { id: user.id } },
        { id: dto.paymentMethodId, user: IsNull() },
      ],
    });

    if (!paymentMethod) {
      throw new ForbiddenException('Invalid payment method');
    }

    const transaction = this.transactionRepository.create({
      amount: dto.amount,
      description: dto.description,
      occurrence: dto.occurrence,
      user: user,
      category,
      paymentMethod,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAll(user: User, month?: string) {
    const where: FindOptionsWhere<Transaction> = {
      user: { id: user.id },
    };

    if (month) {
      const [year, monthNumber] = month.split('-').map(Number);

      const startDate = new Date(year, monthNumber - 1, 1);
      const endDate = new Date(year, monthNumber, 0, 23, 59, 59);

      where.createdAt = Between(startDate, endDate);
    }

    return this.transactionRepository.find({
      where,
      relations: ['category', 'paymentMethod'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(user: User) {
    const result = await this.transactionRepository
      .createQueryBuilder('tx')
      .leftJoin('tx.category', 'category')
      .select([
        `SUM(CASE WHEN category.type = :income THEN tx.amount ELSE 0 END) as income`,
        `SUM(CASE WHEN category.type = :expense THEN tx.amount ELSE 0 END) as expense`,
      ])
      .where('tx.userId = :userId', { userId: user.id })
      .setParameters({
        income: CategoryType.INCOME,
        expense: CategoryType.EXPENSE,
      })
      .getRawOne<StatsRaw>();

    const income = Number(result?.income ?? 0);
    const expense = Number(result?.expense ?? 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }

  async update(id: string, dto: UpdateTransactionDto, user: User) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.user.id !== user.id) {
      throw new ForbiddenException();
    }

    //Actualizar campos simples

    if (dto.amount !== undefined) transaction.amount = dto.amount;
    if (dto.description !== undefined)
      transaction.description = dto.description;

    if (dto.occurrence !== undefined) transaction.occurrence = dto.occurrence;

    // actualizar relaciones (simple versión)
    if (dto.categoryId) {
      transaction.category = { id: dto.categoryId } as Category;
    }

    if (dto.paymentMethodId) {
      transaction.paymentMethod = { id: dto.paymentMethodId } as PaymentMethod;
    }

    return this.transactionRepository.save(transaction);
  }

  async remove(id: string, user: User) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.user.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.transactionRepository.remove(transaction);

    return { message: 'Transaction deleted' };
  }
}
