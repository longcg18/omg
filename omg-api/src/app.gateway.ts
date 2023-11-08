import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
//import { ItemService } from '../src/item/item.service';
//import { Item } from '../src/item/item.entity';
import { OnModuleInit } from '@nestjs/common';
import { from, map } from 'rxjs';
import { ItemService } from './item/item.service';
import { Item } from './item/item.entity';
import { SessionService } from './session/session.service';
  @WebSocketGateway({
    cors: {
      origin: 
        ['http://localhost:4200',
        'http://localhost:3000'  
      ]
      ,
    },
  })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(
    private sessionService: SessionService
    ) {}
  async onModuleInit() {
    //throw new Error('Method not implemented.');
  }

  @WebSocketServer() server: Server;


  @SubscribeMessage('setPrice')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    //await this.itemService.update(payload);
    
    //let updateItem = payload.item;
    let updateSession = payload.session;
    
    await this.sessionService.updateSessionInDatabase(updateSession.id, payload.session)
    this.server.emit('updatedPrice', updateSession);

    //await this.itemService.updateItemInDatabase(updateItem.id, { likes:updateItem.likes });

    //console.log(payload, updateItem);
  }


  @SubscribeMessage('events')
  doStuff(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('client', client);
    return { event: 'events', data };
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  async afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  async handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}