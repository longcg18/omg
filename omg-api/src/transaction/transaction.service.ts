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
    
      async findByOwnerId(userId: any): Promise<Transaction[]> {
        const res = await this.transactionsRepo.createQueryBuilder("transaction")
          .leftJoin("transaction.user", "user")
          .leftJoin("transaction.session", "session")
          .leftJoin("session.item", "item")
          .select(["transaction", "user", "session", "item.plateNumber"])
          .where("user.id=:id", {id: userId})
          .getMany();
        return res; 
      }

      async create(transaction: Transaction): Promise<Transaction> {
        let money = transaction.money;
        let userId = transaction.user.id;
        let sessionId = transaction.session.id;

        // console.log(money, userId, sessionId);
        const existingTransaction = await this.transactionsRepo.createQueryBuilder("transaction")
          .leftJoin("transaction.user", "user")
          .leftJoin("transaction.session", "session")
          .select(["transaction", "user", "session"])
          .where("user.id=:id", {id: userId})
          .andWhere("transaction.money=:money", {money: money})
          .andWhere("session.id=:sid", {sid: sessionId})
          .getOne();

        // console.log("Existing Transaction: ", existingTransaction);
        
        if (existingTransaction) {
          return existingTransaction;
        } else {
          return await this.transactionsRepo.save(transaction);
        }
      }
    
      async update(hostpital : Transaction): Promise<UpdateResult> {
        return await this.transactionsRepo.update(hostpital.id, hostpital);
      }
    
      async delete(id: number): Promise<DeleteResult> {
        return await this.transactionsRepo.delete(id);
      }
}
