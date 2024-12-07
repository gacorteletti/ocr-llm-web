import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

const uploadDir = './uploads';

@Injectable()
export class FileUploadService {
  constructor() {
    this.ensureUploadDirExists();
  }

  ensureUploadDirExists() {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  }

  getMulterStorage() {
    return diskStorage({
      destination: (req, file, callback) => {
        this.ensureUploadDirExists();
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
    });
  }

  getFileFilter() {
    return (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(
          new HttpException(
            'Invalid file type. Only JPEG, JPG and PNG image files are allowed.',
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    };
  }
}
