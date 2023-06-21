import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentLikeDto } from './dto/comment-like.dto';
import { Prisma } from '@prisma/client';
import {v4 as uuid} from 'uuid'
import { CommentUnlikeDto } from './dto/comment-unlike.dto';
@Injectable()
export class CommentLikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentService: CommentService
  ) { }

  async like(userId: string, likeComment: CommentLikeDto) {
    const { commentId } = likeComment;
    await this.commentService.findbyid(commentId)

    const alreadyLiked = await this.prisma.commentLike.findFirst({
      where: {
        user: { id: userId },
        comment: { id: commentId }
      }
    })

    if (alreadyLiked) {
      throw new ConflictException("You already like this comment")
    }

    const data: Prisma.CommentLikeCreateInput = {
      id: uuid(),
      createdAt: new Date(),
      user: {
        connect: { id: userId },
      },
      comment: {
        connect: { id: commentId }
      }
    };

    await this.prisma.commentLike.create({ data })
  }


  async unlike(userId: string, unlikeComment: CommentUnlikeDto) {
    const { commentId } = unlikeComment;

    await this.commentService.findbyid(commentId)
    const like = await this.prisma.commentLike.findFirst({
      where: {
        user: { id: userId },
        comment: { id: commentId }
      }
    })
    if (!like) {
      throw new NotFoundException("Like not found")
    }
    await this.prisma.commentLike.delete({ where: { id: like.id} })
  }
}
