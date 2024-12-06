import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @UseGuards(JwtGuard) // protect route with custom guard
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

  @UseGuards(JwtGuard)
  @Post(':id/analyze')
  async analyzeDocument(
    @Param('id') id: string,
    @Body('query') query: string,
    @GetUser() user: User, // extract user info from JWT
  ): Promise<{ response: string }> {
    const response = await this.documentService.interactWithExtractedText(
      +id,
      query,
      user.id,
    );
    return { response };
  }
}
