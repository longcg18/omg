import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        public readonly ordersRepo: Repository<Order>,
      ) {}
    
      async findAll(): Promise<Order[]> {
        return await this.ordersRepo.find();
      }
    
      async findOne(_id: number): Promise<Order> {
        return await this.ordersRepo.findOneBy({id: _id});
      }
    
      async create(order: Order): Promise<Order> {
        return await this.ordersRepo.save(order);
      }
    
      async update(hostpital : Order): Promise<UpdateResult> {
        return await this.ordersRepo.update(hostpital.id, hostpital);
      }
    
      async delete(id: number): Promise<DeleteResult> {
        return await this.ordersRepo.delete(id);
      }
}
