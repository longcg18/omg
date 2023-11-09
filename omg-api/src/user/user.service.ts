import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        public readonly usersRepo: Repository<User>,
      ) {}
    
      async validateUser(user: User) {
        //validate user here
        const resultByUsername = await this.findByUsername(user.username);
        const resultByEmail = await this.findByEmail(user.email);
        //const resultByIdentityNum = await this.findByIdentityNum(user.identity_num);
        /* Email and Phone -- may be coming soon
        const resultByEmail = await this.findByEmail(user.email);
        const resultByPhone = await this.findByPhone(user.phone);
    
        var checkPass = 0;
        const checkMax = 4;
        
        if (resultByEmail) throw new BadRequestException('Email already used!');
        if (resultByPhone) throw new BadRequestException('Phone number already used!');
        */
        if (resultByUsername == null) {
    
          if (resultByEmail == null) {
            return true;
          } else throw new BadRequestException('Email đã tồn tại!')
        } else throw new BadRequestException('Tên người dùng đã tồn tại!');
      }

      async findAll(): Promise<User[]> {
        return await this.usersRepo.find();
      }
    
      async findOne(_id: number): Promise<User> {
        return await this.usersRepo.findOneBy({id: _id});
      }

      async findByUsername(_username: string): Promise<User> {
        return await this.usersRepo.findOneBy({username: _username});
      }

      async findByEmail(_email: string): Promise<User> {
        return await this.usersRepo.findOneBy({email: _email});
      }
    
      async create(user: User): Promise<User> {
        let saltRounds = 10;

        if (user.username == "admin") {
          user.role = 0;
        }
    
        if (!(await this.validateUser(user)))
          throw new BadRequestException({ error: 'Invalid user information' });
    
        //let pwd = await bcrypt.hash(user.password, saltRounds);
        //user.password = pwd;
        //return await this.usersRepo.save(user);
        return await this.usersRepo.save(user);
      }
    
      async update(hostpital : User): Promise<UpdateResult> {
        return await this.usersRepo.update(hostpital.id, hostpital);
      }
    
      async validatePassword(_username: string, password: string): Promise<boolean> {
        var res = false;
        var pass = (await this.usersRepo.findOneBy({username: _username})).password;
        return (pass == password);
      }

      async delete(id: number): Promise<DeleteResult> {
        return await this.usersRepo.delete(id);
      }
}
