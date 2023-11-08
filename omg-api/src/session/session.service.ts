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
      return await this.sessionsRepo.createQueryBuilder("session")
        .leftJoin("session.item", "item")
        .leftJoin("session.winner", "user")
        .select(["session","item","user"])
        .getMany();
      //return await this.sessionsRepo.find();
    }
  
    async findOne(_id: number): Promise<Session> {

      return await this.sessionsRepo.createQueryBuilder("session")
      .leftJoin("session.item", "item")
      .leftJoin("session.winner", "user")
      .select(["session","item","user"])
      .where("session.id=:id", {id: _id}).getOne();


      //return await this.sessionsRepo.findOneBy({id: _id});
    }
  
    async findByUserId(_id: any): Promise<Session[]> {
      return await this.sessionsRepo.createQueryBuilder("session")
      .leftJoin("session.item", "item")
      .leftJoin("session.winner", "user")
      .select(["session","item","user"])
      .where("user.id=:id", {id: _id}).getMany();
    }

    async create(session: Session): Promise<Session> {
      return await this.sessionsRepo.save(session);
    }
  
    async update(session : Session): Promise<UpdateResult> {
      return await this.sessionsRepo.update(session.id, session);
    }
  
    async delete(id: number): Promise<DeleteResult> {
      return await this.sessionsRepo.delete(id);
    }


    async updateSessionInDatabase(_id: number, updatedFields: any): Promise<Session | undefined> {
      console.log(updatedFields);
      try {
          const existingSession = await this.sessionsRepo.createQueryBuilder("session").leftJoin("session.winner", "user").select(["session", "user"]).where("session.id=:id", {id: _id}).getOne();
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
