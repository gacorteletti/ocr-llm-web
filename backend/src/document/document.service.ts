import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async saveDocument(file: Express.Multer.File, userId: number) {
    // Save metadata in database
    const document = await this.prisma.document.create({
      data: {
        filename: file.filename,
        path: file.path,
        userId: userId, // associated to auth'ed user
      },
    });
    return {
      msg: 'File uploaded succesfully',
      document,
    };
  }
}
