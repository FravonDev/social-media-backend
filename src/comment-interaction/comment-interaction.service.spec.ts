import { Test, TestingModule } from '@nestjs/testing';
import { CommentInteractionService } from './comment-interaction.service';

describe('CommentInteractionService', () => {
  let service: CommentInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentInteractionService],
    }).compile();

    service = module.get<CommentInteractionService>(CommentInteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
