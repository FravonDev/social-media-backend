import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid'
import { Prisma } from '@prisma/client';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService
  ) { }
  async create(userId, createComment: CreateCommentDto) {
    const { postId, text } = createComment;

    await this.postService.findById(postId)

    const data: Prisma.CommentCreateInput = {
      id: uuid(),
      text,
      user: {
        connect: { id: userId },
      },
      post: {
        connect: { id: postId },
      },
      createdAt: new Date(),

    };

    await this.prisma.comment.create({ data })
  }

  async update(updateComment: UpdateCommentDto) {
    const { commentId, text } = updateComment;

    await this.findbyid(commentId)
    const updatedAt = new Date()
    await this.prisma.comment.update({ data: { text, updatedAt }, where: { id: commentId } })
  }

  async remove(commentId: string) {
    await this.findbyid(commentId)
    await this.prisma.comment.delete({ where: { id: commentId } })
  }

  async findRelevantComments(postId: string, offset: number, limit: number) {
    const comments = await this.prisma.comment.findMany({
      where: { post: { id: postId } },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit
    }
    )
    return comments
  }

  async findbyid(commentId: string) {
    const commentExists = await this.prisma.comment.findUnique({ where: { id: commentId } })
    if (!commentExists) {
      throw new NotFoundException('Comment not found')
    }
  }

}
