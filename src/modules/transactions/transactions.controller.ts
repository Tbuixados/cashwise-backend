import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'common/decorators/current-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.create(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.transactionService.findAll(user);
  }
}
