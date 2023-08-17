import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid'
import { Prisma } from '@prisma/client';
import { PostService } from 'src/post/post.service';
import { CommentLikeDto } from './dto/comment-like.dto';
import { CommentUnlikeDto } from './dto/comment-unlike.dto';

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

    const createdComment = await this.prisma.comment.create({ data })

    const comment = await this.prisma.comment.findUnique({
      where: { id: createdComment.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            photo: true,
          },
        },
        Likes: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { Likes: true },
        },
      },
    });

    return comment
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

  async like(userId: string, likeComment: CommentLikeDto) {
    const { commentId } = likeComment;
    await this.findbyid(commentId)

    const alreadyLiked = await this.prisma.like.findFirst({
      where: {
        user: { id: userId },
        comment: { id: commentId }
      }
    })

    if (alreadyLiked) {
      throw new ConflictException("You already like this comment")
    }

    const data: Prisma.LikeCreateInput = {
      id: uuid(),
      createdAt: new Date(),
      user: {
        connect: { id: userId },
      },
      comment: {
        connect: { id: commentId }
      }
    };

    await this.prisma.like.create({ data })
  }

  async unlike(userId: string, unlikeComment: CommentUnlikeDto) {
    const { commentId } = unlikeComment;

    await this.findbyid(commentId)
    const like = await this.prisma.like.findFirst({
      where: {
        user: { id: userId },
        comment: { id: commentId }
      }
    })
    if (!like) {
      throw new NotFoundException("Like not found")
    }
    await this.prisma.like.delete({ where: { id: like.id } })
  }

  async findPost(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            photo: true
          }
        },
        Likes: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { Likes: true }
        }
      },
    }
    )

    return comment
  }


  async findRelevantComments(userId: string, postId: string, offset: number, limit: number) {
    const comments = await this.prisma.comment.findMany({
      where: { post: { id: postId } },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            photo: true
          }
        },
        Likes: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { Likes: true }
        }
      },
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
