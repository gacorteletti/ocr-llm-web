import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OcrProcessingService {
  async extractText(filePath: string): Promise<string> {
    try {
      const processedDir = path.join(__dirname, '../../processed_uploads');
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir); // create directory if it doesn't exist
      }

      const processedPath = path.join(
        processedDir,
        `processed_${path.basename(filePath)}`,
      );

      await sharp(filePath).resize(1000).toFile(processedPath); // resize image for faster processing

      const worker = await Tesseract.createWorker();
      const { data } = await worker.recognize(processedPath);
      await worker.terminate();

      return data.text; // return extracted text
    } catch (error) {
      console.error('OCR ERROR:', error);
      throw new Error('Failed to extract text from the document');
    }
  }
}
