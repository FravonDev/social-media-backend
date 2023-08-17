import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Image } from '@prisma/client';
import sharp from 'sharp';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageUploadService {
  constructor(private readonly prisma: PrismaService) { }

  async uploadImage(file: Express.Multer.File, uploadedBy: string) {
    if (!file) {
      throw new BadRequestException('No file attached');
    }

    const { buffer } = file;

    const compressedBuffer: Buffer = await sharp(buffer)
      .resize({
        width: 800,
        height: 800,
        fit: 'cover',
      })
      .webp({ quality: 100, force: true })
      .toBuffer();
    const id = uuid()
    const newMimetype = 'image/webp';
    const filename = `${id}${'.' + newMimetype}`;

    const createImageData: Prisma.ImageCreateInput = {
      id,
      filename,
      contentType: newMimetype,
      data: Buffer.from(compressedBuffer),
      uploadedBy: { connect: { id: uploadedBy } },
    };
    const createdImage = await this.prisma.image.create({ data: createImageData });
    const response = {
      imageUrl: `http://localhost:3000/image/${createdImage.id}`,
    };

    return response;

  }

  async getImageById(imageId: string): Promise<Image | null> {
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
    });
    return image;
  }
}