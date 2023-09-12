import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
  const app = await NestFactory.create(AppModule);
  app.enableCors(options);
  await app.listen(8080);
}
bootstrap();
