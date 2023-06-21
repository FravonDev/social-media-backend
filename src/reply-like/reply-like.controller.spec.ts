import { Test, TestingModule } from '@nestjs/testing';
import { ReplyLikeController } from './reply-like.controller';
import { ReplyLikeService } from './reply-like.service';

describe('ReplyLikeController', () => {
  let controller: ReplyLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplyLikeController],
      providers: [ReplyLikeService],
    }).compile();

    controller = module.get<ReplyLikeController>(ReplyLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
