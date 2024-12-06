import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @UseGuards(JwtGuard) // protect route with custom guard
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // handle single file upload
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any, // automatically calls JwtStrategy.validate
  ) {
    if (!file) {
      throw new BadRequestException('No file provided'); // Throw an error if file is undefined
    }
    const userId = req.user.id; // get user id
    return this.documentService.saveDocument(file, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/analyze')
  async analyzeDocument(
    @Param('id') id: string,
    @Body('query') query: string,
  ): Promise<{ response: string }> {
    const response = await this.documentService.interactWithExtractedText(
      +id,
      query,
    );
    return { response };
  }
}
