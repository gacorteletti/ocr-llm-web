import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
