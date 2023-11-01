import { Injectable } from '@nestjs/common';
import { Item } from './item.entity';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
//import { SocketGateway } from 'src/socketGateway';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>
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

    async updateItemInDatabase(_id: number, updatedFields: Partial<Item>): Promise<Item | undefined> {
        try {
            const existingItem = await this.itemRepo.createQueryBuilder("item").select(["item"]).where("item.id=:id", {id: _id}).getOne();
            console.log('Existing', _id,  existingItem);
            if (existingItem) {
                await this.itemRepo.update(_id, updatedFields);
                const updatedItem = await this.itemRepo.findOneBy({id: _id});
                return updatedItem;
            }

            return undefined; // Trả về undefined nếu không tìm thấy item
        } catch (error) {
            console.error('Error updating item:', error);
            throw new Error('Error updating item in the database');
            }
        }
}
