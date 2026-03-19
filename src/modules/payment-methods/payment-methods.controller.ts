import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentMethodsService } from './payment-methods.service';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.paymentMethodsService.findAll(user);
  }
}
