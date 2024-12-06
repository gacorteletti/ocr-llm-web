import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OcrProcessingService } from '../ocr-processing/ocr-processing.service';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private ocrProcessing: OcrProcessingService,
  ) {}

  async saveDocument(file: Express.Multer.File, userId: number) {
    // Perform OCR processing
    const extractedText = await this.ocrProcessing.extractText(file.path);

    // Save metadata in database
    const document = await this.prisma.document.create({
      data: {
        filename: file.filename,
        path: file.path,
        userId: userId, // associated to auth'ed user
        extractedText, // append ocr extracted text
      },
    });
    return {
      msg: 'File uploaded succesfully',
      document,
    };
  }
}
