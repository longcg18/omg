import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
      console.log(req);
      return this.authService.login(req.user);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  
}
