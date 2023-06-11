import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('image')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}
  @IsPublic()
  @Post('upload')
  @ApiOperation({ summary: 'Upload image' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiBody({
    description: 'Image in format JPG, JPEG ou PNG',
    type: 'object',
    schema: {
      format: 'binary',
      type: 'file'
    }
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split(`.`)[1];
          const newFileName = uuid() + '.' + fileExtension;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.imageUploadService.uploadImage(file)
  }

  @IsPublic()
  @ApiResponse({ status: 200, description: 'Created' })
  @ApiOperation({ summary: 'Get image' })
  @Get('/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    const filePath = `./uploads/${filename}`;
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('image not found.');
    }
    res.sendFile(filename, { root: './uploads' });
  }
}
