import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './modules/categories/categories.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    PaymentMethodsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
