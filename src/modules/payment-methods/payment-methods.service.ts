import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  async findAll(user: User) {
    return this.paymentMethodRepo.find({
      where: [{ user: { id: user.id } }, { user: IsNull() }],
      order: { name: 'ASC' },
    });
  }
}
