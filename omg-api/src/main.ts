import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './socket-io.adapter';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.enableCors();
  app.use(json({limit:'50mb'}));
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(3000);

}
bootstrap();

