import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  const corsOptions: CorsOptions = {
    origin: process.env.FRONTEND_URL, // allow requests from frontend
    credentials: true,
  };
  app.enableCors(corsOptions);

  // Serve files from the uploads directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3333);
}
bootstrap();
