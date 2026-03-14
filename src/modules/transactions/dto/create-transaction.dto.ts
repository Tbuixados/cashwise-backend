import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionOccurrence } from 'common/enums/transaction-occurrence.enum';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TransactionOccurrence)
  occurrence: TransactionOccurrence;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  paymentMethodId: string;
}
