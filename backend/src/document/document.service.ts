import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OcrProcessingService } from '../ocr-processing/ocr-processing.service';
import { LlmService } from '../llm/llm.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private ocrProcessing: OcrProcessingService,
    private llm: LlmService,
    private config: ConfigService,
  ) {}

  async createDocumentZip(documentId: number): Promise<Buffer> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { interactions: true },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const originalFilePath = path.join(uploadsDir, document.filename);

    const zip = new AdmZip();

    if (fs.existsSync(originalFilePath)) {
      zip.addLocalFile(originalFilePath);
    }

    // Create formatted txt file with text and interactions
    const textContent = this.formatDocumentText(
      document.extractedText || 'No extracted text available.',
      document.interactions,
    );

    // Add the text file to the ZIP
    const textFileName = 'ExtractedText_and_Interactions.txt';
    zip.addFile(textFileName, Buffer.from(textContent, 'utf-8'));

    // Return the ZIP file as a buffer
    return zip.toBuffer();
  }

  private formatDocumentText(
    extractedText: string,
    interactions: Array<{ query: string; response: string }>,
    lineWidth = 80,
  ): string {
    const wrapText = (text: string, width: number): string => {
      const regex = new RegExp(`(.{1,${width}})(\\s+|$)`, 'g');
      return text.match(regex)?.join('\n') ?? text;
    };

    let content = `-> EXTRACTED TEXT\n\n${wrapText(extractedText, lineWidth)}\n\n`;
    content += `-------------------------------------------------------------------------------------\n\n`;

    interactions.forEach((interaction) => {
      content += `-> QUERY\n\n${wrapText(interaction.query, lineWidth)}\n\n`;
      content += `-> REPLY\n\n${wrapText(interaction.response, lineWidth)}\n\n`;
      content += `-------------------------------------------------------------------------------------\n\n`;
    });

    return content.trim();
  }

  async getInteractionsByDocumentId(documentId: number) {
    return this.prisma.interaction.findMany({
      where: { documentId },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        query: true,
        response: true,
        createdAt: true,
      },
    });
  }

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
