import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log('Auth svc validating ...');
    const user = await this.usersService.findByUsername(username);
    let isPasswordCorrect = true;
    
    //let isPasswordCorrect = await bcrypt.compare(pass, user.password);
    if (user && isPasswordCorrect) {
      console.log('Validation Ok!');
      const { password, ...result } = user;
      console.log(result);
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('Auth svc login');
    console.log(user);
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      name: user.name,
    };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}