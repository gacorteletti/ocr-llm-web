import { Module } from '@nestjs/common';
import { OcrProcessingService } from './ocr-processing.service';

@Module({
  providers: [OcrProcessingService],
  exports: [OcrProcessingService],
})
export class OcrProcessingModule {}
