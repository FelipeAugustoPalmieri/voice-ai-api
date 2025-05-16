import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProcessAudioDto } from './dto/process-audio.dto';
import OpenAI from 'openai';
import { Readable } from 'stream';
import { AudioResponse } from './interfaces/audio-response.interface';

@Injectable()
export class AudioService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async processAudio(processAudioDto: ProcessAudioDto): Promise<AudioResponse> {
    const { audio, language } = processAudioDto;
    
    // Transcrição de áudio
    const transcription = await this.transcribeAudio(audio, language);

    // Geração de resposta
    const aiResponse = await this.generateAIResponse(transcription);

    return { transcription, aiResponse };
  }

  private async transcribeAudio(
    file: Express.Multer.File,
    language?: string,
  ): Promise<string> {
    const audioReadStream = Readable.from(file.buffer);

    const response = await this.openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: language || 'pt',
      response_format: 'text',
    });

    return response as unknown as string;
  }

  private async generateAIResponse(prompt: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond in the same language as the user input.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }
}