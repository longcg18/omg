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
      const res = await this.ordersRepo.createQueryBuilder("order")
        .leftJoin("order.item", "item")
        .leftJoin("order.user", "user")
        .select(["order", "item", "user"])
        .getMany();
      return res;
    }
  
    async findOne(_id: number): Promise<Order> {
      const res = await this.ordersRepo.createQueryBuilder("order")
        .leftJoin("order.item", "item")
        .leftJoin("order.user", "user")
        .select(["order", "item", "user"])
        .where("order.id=:id", {id:_id})
        .getOne();
      return res;
    }
  
    async getAllByOwnerId(_id: any): Promise<Order[]> {
      console.log(_id);
      const res = await this.ordersRepo.createQueryBuilder("order")
        .leftJoin("order.item", "item")
        .leftJoin("order.user", "user")
        .select(["order", "item", "user"])
        .where("user.id=:id", {id:_id})
        .getMany();
      return res;
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
