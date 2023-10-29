import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './item.entity';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll(): Promise<Item[]>{
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id')id :string): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() item: Item) {
    return this.itemService.create(item);
  }

  @Put()
  update(@Body() item: Item) {
    return this.itemService.update(item);
  }
}
