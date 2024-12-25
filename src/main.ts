import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.enableCors({
    origin:"*"
  })
  app.setGlobalPrefix('/api/v1');

  //ValidationPipe is a built-in pipe in NestJS used for:

// Validation: Validates incoming request data based on class-validator decorators in the DTOs (Data Transfer Objects).
// Transformation: Automatically transforms plain JavaScript objects into instances of specific classes (e.g., converting query parameters to a DTO instance).
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
