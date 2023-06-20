import { Injectable } from '@nestjs/common';
import { CreateCommentInteractionDto } from './dto/create-comment-interaction.dto';
import { UpdateCommentInteractionDto } from './dto/update-comment-interaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentInteractionService {
  constructor(private readonly prisma: PrismaService) { }
  create(createCommentInteractionDto: CreateCommentInteractionDto) {
    return 'This action adds a new commentInteraction';
  }

  findAll() {
    return `This action returns all commentInteraction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentInteraction`;
  }

  update(id: number, updateCommentInteractionDto: UpdateCommentInteractionDto) {
    return `This action updates a #${id} commentInteraction`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentInteraction`;
  }
}
