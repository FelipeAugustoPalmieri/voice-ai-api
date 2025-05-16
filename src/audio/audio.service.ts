import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProcessAudioDto } from './dto/process-audio.dto';
import OpenAI from 'openai';
import { AudioResponse } from './entities/audio-response.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

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
    const tempFilePath = path.join(
      os.tmpdir(),
      `${uuidv4()}-${file.originalname || 'audio.mp3'}`,
    );
    await fs.promises.writeFile(tempFilePath, file.buffer);

    const fileStream = fs.createReadStream(tempFilePath);

    const response = await this.openai.audio.transcriptions.create({
      file: fileStream,
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
          content:
            'You are a helpful assistant. Respond in the same language as the user input.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content || '';
  }
}