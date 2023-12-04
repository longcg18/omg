import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll(): Promise<Item[]>{
    return this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id')id : any, @Res() res: Response) {
    //return this.itemService.findOne(id);
    let item = await this.itemService.findOne(id);
    var base64Images = null;
    if (item.image) {
      base64Images = Buffer.from(item.image).toString('base64');
      item.image = base64Images;
    }


    res.send(item)

    // return {
    //   id: item.id,
    //   plateNumber: item.plateNumber,
    //   vendor: item.vendor,
    //   type: item.type,
    //   image: base64Images,
    // };
    // let a = await this.itemService.findOne(id);
    // res.set({
    //   'Content-Type': '',
    //   'Content-Disposition': 'item; imageName=' + a.imageName,
    // });
    // res.send(a.image);
  }

  @Get('owner/:id')
  findByUserId(@Param('id')id: number): Promise<Item[]> {
    return this.itemService.findByOwnerId(id);
  }

  @Post()
  create(@Body() item: Item) {
    return this.itemService.create(item);
  }

  @Put()
  update(@Body() item: Item) {
    return this.itemService.update(item);
  }

  @Delete(':id')
  remove(@Param('id')id: any) {
    return this.itemService.delete(+id);
  } 

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const temp = {...body}
    temp.image = file.buffer;
    temp.imageName = file.filename;
    return this.itemService.create(temp);
  }

}
