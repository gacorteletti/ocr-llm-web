import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // allow requests from frontend
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
