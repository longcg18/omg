import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  create(@Body() order: Order) {
    return this.ordersService.create(order);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Get('owner/:id')
  getAllByOwnerId(@Param('id') id: any) {
    return this.ordersService.getAllByOwnerId(id);
  }
  @Put()
  update(@Body() order: Order) {
    return this.ordersService.update(order);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.delete(+id);
  }
}
