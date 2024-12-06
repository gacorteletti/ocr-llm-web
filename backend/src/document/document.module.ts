import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { OcrProcessingModule } from '../ocr-processing/ocr-processing.module';

@Module({
  imports: [FileUploadModule, OcrProcessingModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
