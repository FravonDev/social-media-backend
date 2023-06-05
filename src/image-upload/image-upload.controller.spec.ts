import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadController } from './image-upload.controller';
import { ImageUploadService } from './image-upload.service';

describe('ImageUploadController', () => {
  let controller: ImageUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageUploadController],
      providers: [ImageUploadService],
    }).compile();

    controller = module.get<ImageUploadController>(ImageUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
