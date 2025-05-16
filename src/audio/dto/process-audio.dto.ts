export class ProcessAudioDto {
  readonly audio: Express.Multer.File;
  readonly language?: string;
}