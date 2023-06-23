import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
  controllers: [ImageUploadController],
  providers: [ImageUploadService]
})
export class ImageUploadModule { }
