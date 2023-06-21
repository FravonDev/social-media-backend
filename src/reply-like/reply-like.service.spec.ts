import { Test, TestingModule } from '@nestjs/testing';
import { ReplyLikeService } from './reply-like.service';

describe('ReplyLikeService', () => {
  let service: ReplyLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplyLikeService],
    }).compile();

    service = module.get<ReplyLikeService>(ReplyLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
