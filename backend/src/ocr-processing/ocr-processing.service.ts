import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrProcessingService {
  async extractText(filePath: string): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(filePath, 'eng'); // assuming english is the language
      return data.text; // return extracted text
    } catch (error) {
      console.error('OCR ERROR:', error);
      throw new Error('Failed to extract text from the document');
    }
  }
}
