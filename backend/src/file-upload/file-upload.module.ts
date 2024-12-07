import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadDir = './uploads';
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = extname(file.originalname);
          const cleanName = file.originalname
            .replace(/[^a-zA-Z0-9]/g, '_')
            .split(fileExt)[0];
          callback(null, `${cleanName}-${uniqueSuffix}${fileExt}`);
        },
      }),

      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/png']; // tesseract was having issues with the others
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              'Invalid file type. Only PNG image files are allowed.',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  ],
  exports: [MulterModule],
})
export class FileUploadModule {}
