import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorySection } from 'common/enums/category-section.enum';
import { CategoryType } from 'common/enums/category-type.enum';
import { Category } from 'src/modules/categories/entities/category.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCategories();
    await this.seedPaymentMethods();
  }

  private async seedCategories() {
    const count = await this.categoryRepo.count();

    if (count > 0) return;

    const categories = [
      {
        name: 'Food',
        color: '#FF6B6B',
        type: CategoryType.EXPENSE,
        section: CategorySection.FOOD,
      },
      {
        name: 'Rent',
        color: '#4ECDC4',
        type: CategoryType.EXPENSE,
        section: CategorySection.HOUSING,
      },
      {
        name: 'Transport',
        color: '#FFD93D',
        type: CategoryType.EXPENSE,
        section: CategorySection.TRANSPORT,
      },
      {
        name: 'Entertainment',
        color: '#A29BFE',
        type: CategoryType.EXPENSE,
        section: CategorySection.ENTERTAINMENT,
      },
      {
        name: 'Salary',
        color: '#6BCB77',
        type: CategoryType.INCOME,
        section: CategorySection.SALARY,
      },
    ];

    await this.categoryRepo.save(categories);

    console.log('Categories seeded');
  }

  private async seedPaymentMethods() {
    const count = await this.paymentMethodRepo.count();

    if (count > 0) return;

    const methods = [{ name: 'Cash' }, { name: 'Card' }, { name: 'Transfer' }];

    await this.paymentMethodRepo.save(methods);

    console.log('Payment methods seeded');
  }
}
