import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OcrProcessingService } from '../ocr-processing/ocr-processing.service';
import { LlmService } from '../llm/llm.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private ocrProcessing: OcrProcessingService,
    private llm: LlmService,
    private config: ConfigService,
  ) {}

  async deleteDocumentById(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async getDocumentByIdAndUser(id: number, userId: number) {
    const document = await this.prisma.document.findFirst({
      where: { id, userId },
      select: {
        id: true,
        filename: true,
        path: true,
        createdAt: true,
        extractedText: true,
      },
    });
    const BE_url = this.config.get('BACKEND_URL');
    return {
      ...document,
      url: `${BE_url}/uploads/${document.filename}`,
    };
  }

  async getDocumentsByUser(userId: number) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      select: {
        id: true,
        filename: true,
        path: true,
        createdAt: true,
        extractedText: true,
      },
    });
    // append file url for frontend visualization
    const BE_url = this.config.get('BACKEND_URL');
    return documents.map((doc) => ({
      ...doc,
      url: `${BE_url}/uploads/${doc.filename}`,
    }));
  }

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
    return { msg: 'File uploaded succesfully', document };
  }

  async interactWithExtractedText(
    documentId: number,
    query: string,
    userId: number,
  ): Promise<string> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // check ownership
    if (document.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this document',
      );
    }

    const prompt = `Consider this text:\n\n"${document.extractedText}"\n\nNow humanly answer this: ${query}`;
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
