import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './session.entity';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionsService: SessionService) {}

  @Post()
  create(@Body() session: Session) {
    return this.sessionsService.create(session);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: any) {
    return this.sessionsService.findByUserId(id);
  }

  @Get('history')
  findPerfect() {
    return this.sessionsService.findHistory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }

  @Put()
  update(@Body() session: any) {
    return this.sessionsService.update(session);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.delete(+id);
  }
}
