import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('sse')
  testSee() {
    return interval(3000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
