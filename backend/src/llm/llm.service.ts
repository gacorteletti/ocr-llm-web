import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeText(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });
      return completion.choices[0]?.message?.content ?? 'No response';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to process the text with LLM');
    }
  }
}
