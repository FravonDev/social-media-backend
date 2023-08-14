import { Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { uploadOptions } from './config/upload-image.config';

@Controller('image')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload image' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiBody({
    description: 'Image in format JPG, JPEG',
    type: 'object',
    schema: {
      format: 'binary',
      type: 'file'
    }
  })
  @UseInterceptors(
    FileInterceptor('file', uploadOptions),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    return await this.imageUploadService.uploadImage(file, user.id);
  }

  @IsPublic()
  @ApiResponse({ status: 200, description: 'Created' })
  @ApiOperation({ summary: 'Get image' })
  @Get('/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    const image = await this.imageUploadService.getImageById(filename);

    if (!image) {
      throw new NotFoundException('Image not found.');
    }

    res.setHeader('Content-Type', image.contentType);

    res.send(image.data);
  }
}