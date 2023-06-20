import { Test, TestingModule } from '@nestjs/testing';
import { CommentInteractionController } from './comment-interaction.controller';
import { CommentInteractionService } from './comment-interaction.service';

describe('CommentInteractionController', () => {
  let controller: CommentInteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentInteractionController],
      providers: [CommentInteractionService],
    }).compile();

    controller = module.get<CommentInteractionController>(CommentInteractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
