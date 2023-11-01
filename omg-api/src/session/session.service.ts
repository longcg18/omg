import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionService {
  constructor(
      @InjectRepository(Session)
      public readonly sessionsRepo: Repository<Session>,
    ) {}
  
    async findAll(): Promise<Session[]> {
      return await this.sessionsRepo.createQueryBuilder("session").leftJoin("session.item", "item").select(["session","item"]).getMany();


      return await this.sessionsRepo.find();
    }
  
    async findOne(_id: number): Promise<Session> {

      return await this.sessionsRepo.createQueryBuilder("session").leftJoin("session.item", "item").select(["session","item"]).where("session.id=:id", {id: _id}).getOne();


      return await this.sessionsRepo.findOneBy({id: _id});
    }
  
    async create(session: Session): Promise<Session> {
      return await this.sessionsRepo.save(session);
    }
  
    async update(hostpital : Session): Promise<UpdateResult> {
      return await this.sessionsRepo.update(hostpital.id, hostpital);
    }
  
    async delete(id: number): Promise<DeleteResult> {
      return await this.sessionsRepo.delete(id);
    }


    async updateSessionInDatabase(_id: number, updatedFields: Partial<Session>): Promise<Session | undefined> {
      try {
          const existingSession = await this.sessionsRepo.createQueryBuilder("session").select(["session"]).where("session.id=:id", {id: _id}).getOne();
          console.log('Existing', _id,  existingSession);
          if (existingSession) {
              await this.sessionsRepo.update(_id, updatedFields);
              const updatedSession = await this.sessionsRepo.findOneBy({id: _id});
              return updatedSession;
          }

          return undefined; // Trả về undefined nếu không tìm thấy sessions
      } catch (error) {
          console.error('Error updating sessions:', error);
          throw new Error('Error updating sessions in the database');
          }
      }
}
