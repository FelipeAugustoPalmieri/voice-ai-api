import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioService } from './audio.service';
import { ProcessAudioDto } from './dto/process-audio.dto';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Audio Processing')
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('process')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Process audio and get AI response' })
  @ApiResponse({ status: 201, description: 'Audio processed successfully' })
  async processAudio(
    @UploadedFile() audio: Express.Multer.File,
    @Body() body: Omit<ProcessAudioDto, 'audio'>,
  ): Promise<{ transcription: string; aiResponse: string }> {
    return this.audioService.processAudio({ audio, ...body });
  }
}