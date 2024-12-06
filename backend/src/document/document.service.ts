import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OcrProcessingService } from '../ocr-processing/ocr-processing.service';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private ocrProcessing: OcrProcessingService,
    private llm: LlmService,
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

  async interactWithExtractedText(
    documentId: number,
    query: string,
  ): Promise<string> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    const prompt = `Analyze the following text:\n\n"${document.extractedText}"\n\nQuery: ${query}`;
    const response = await this.llm.analyzeText(prompt);

    // Log the interaction in the database
    await this.prisma.interaction.create({
      data: {
        documentId,
        query,
        response,
      },
    });

    return response;
  }
}
