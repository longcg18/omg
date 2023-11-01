import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Post()
  create(@Body() transaction: Transaction) {
    return this.transactionsService.create(transaction);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Put()
  update(@Body() transaction: Transaction) {
    return this.transactionsService.update(transaction);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.delete(+id);
  }
}
