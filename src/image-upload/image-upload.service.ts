import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException();
    } else {
      const response = {
        filePath: `http://localhost:3000/image/${file.filename}`,
      };
      return response;
    }
  }
}
