import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../auth/decorator';
import { Response } from 'express';
import { User } from '@prisma/client';
import { join } from 'path';
import * as fs from 'fs/promises';

@UseGuards(JwtGuard)
@Controller('documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Get() // .../documents for grid of user's documents
  async getUserDocuments(@GetUser() user: User) {
    return this.documentService.getDocumentsByUser(user.id);
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string, @GetUser() user: User) {
    const document = await this.documentService.getDocumentByIdAndUser(
      parseInt(id, 10),
      user.id,
    );

    if (!document) {
      throw new UnauthorizedException('Access denied.');
    }

    return document;
  }

  @Get('download/:id')
  async downloadDocument(
    @Param('id') id: string,
    @Res() res: Response,
    @GetUser() user: User,
  ) {
    const document = await this.documentService.getDocumentByIdAndUser(
      parseInt(id, 10),
      user.id,
    );

    if (!document) {
      throw new UnauthorizedException('Access denied.');
    }

    const zipBuffer = await this.documentService.createDocumentZip(document.id);
    const zipFileName = '`${path.parse(document.filename).name}.zip`';

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${zipFileName}`,
    });

    res.send(zipBuffer);
  }

  @Get(':id/interactions')
  async getDocumentInteractions(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    const document = await this.documentService.getDocumentByIdAndUser(
      parseInt(id, 10),
      user.id,
    );

    if (!document) {
      throw new UnauthorizedException('Access denied.');
    }

    const interactions = await this.documentService.getInteractionsByDocumentId(
      parseInt(id, 10),
    );
    return interactions;
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @GetUser() user: User) {
    const document = await this.documentService.getDocumentByIdAndUser(
      parseInt(id, 10),
      user.id,
    );

    if (!document) {
      throw new UnauthorizedException('Access denied.');
    }

    const filePath = join(process.cwd(), document.path);
    await fs.unlink(filePath).catch((err) => {
      console.error(`Error deleting file: ${filePath}`, err);
    });

    const processedFilePath = join(
      process.cwd(),
      'processed_uploads',
      `processed_${document.filename}`,
    );
    await fs.unlink(processedFilePath).catch((err) => {
      console.error(`Error deleting processed file: ${processedFilePath}`, err);
    });

    await this.documentService.deleteDocumentById(parseInt(id, 10));
    return { message: 'Document deleted successfully.' };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // handle single file upload
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User, // automatically calls JwtStrategy.validate
  ) {
    if (!file) {
      throw new BadRequestException('No file provided'); // Throw an error if file is undefined
    }
    return this.documentService.saveDocument(file, user.id);
  }

  @Post(':id/analyze')
  async analyzeDocument(
    @Param('id') id: string,
    @Body('query') query: string,
    @GetUser() user: User, // extract user info from JWT
  ): Promise<{ response: string }> {
    const response = await this.documentService.interactWithExtractedText(
      parseInt(id, 10),
      query,
      user.id,
    );
    return { response };
  }
}
