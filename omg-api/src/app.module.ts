import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { AppGateway } from './app.gateway';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { SessionModule } from './session/session.module';
import { OrderModule } from './order/order.module';
//import { }
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '20021387',
      database: 'omg',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    ItemModule,
    UserModule,
    TransactionModule,
    SessionModule,
    OrderModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
