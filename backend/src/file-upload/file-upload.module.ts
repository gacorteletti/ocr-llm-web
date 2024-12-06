import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
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
        // filter to accept only images files
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error('Invalid file type. Only JPEG and PNG are allowed.'),
            false,
          );
        }
      },
    }),
  ],
  exports: [MulterModule],
})
export class FileUploadModule {}
