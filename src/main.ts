import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000', // Altere para o domínio do seu frontend
    methods: 'POST',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(4000);
}
bootstrap();