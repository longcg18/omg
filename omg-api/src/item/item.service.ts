import { Injectable } from '@nestjs/common';
import { Item } from './item.entity';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}
    
    async findAll(): Promise<Item[]> {
        return await this.itemRepo.find();
    }

    async findOne(_id): Promise<Item> {
        return await this.itemRepo.findOneBy({id: _id});
    }

    async findByPlateNumber(_plateNumber): Promise<Item> {
        return await this.itemRepo.findOneBy({plateNumber: _plateNumber});
    }

    async create(item: Item): Promise<Item> {
        return await this.itemRepo.save(item);
    }

    async update(item: Item): Promise<UpdateResult> {
        return await this.itemRepo.update(item.id, item);
    }
}
