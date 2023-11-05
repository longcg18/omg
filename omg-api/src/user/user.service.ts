import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        public readonly usersRepo: Repository<User>,
      ) {}
    
      async findAll(): Promise<User[]> {
        return await this.usersRepo.find();
      }
    
      async findOne(_id: number): Promise<User> {
        return await this.usersRepo.findOneBy({id: _id});
      }

      async findByUsername(_username: string): Promise<User> {
        return await this.usersRepo.findOneBy({username: _username});
      }
    
      async create(user: User): Promise<User> {

        return await this.usersRepo.save(user);
      }
    
      async update(hostpital : User): Promise<UpdateResult> {
        return await this.usersRepo.update(hostpital.id, hostpital);
      }
    
      async delete(id: number): Promise<DeleteResult> {
        return await this.usersRepo.delete(id);
      }
}
