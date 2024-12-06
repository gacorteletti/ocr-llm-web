import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { PrismaModule } from './prisma/prisma.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { OcrProcessingModule } from './ocr-processing/ocr-processing.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // include globally
    AuthModule,
    UserModule,
    DocumentModule,
    PrismaModule,
    FileUploadModule,
    OcrProcessingModule,
    LlmModule,
  ],
})
export class AppModule {}
