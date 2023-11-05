import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        public readonly transactionsRepo: Repository<Transaction>,
      ) {}
    
      async findAll(): Promise<Transaction[]> {
        return await this.transactionsRepo.find();
      }
    
      async findOne(_id: number): Promise<Transaction> {
        return await this.transactionsRepo.findOneBy({id: _id});
      }
    
      async create(transaction: Transaction): Promise<Transaction> {
        return await this.transactionsRepo.save(transaction);
      }
    
      async update(hostpital : Transaction): Promise<UpdateResult> {
        return await this.transactionsRepo.update(hostpital.id, hostpital);
      }
    
      async delete(id: number): Promise<DeleteResult> {
        return await this.transactionsRepo.delete(id);
      }
}
