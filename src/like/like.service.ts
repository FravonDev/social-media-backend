import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/like.dto';
import { UnlikeDto } from './dto/unlike.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid'

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) { }

  async like(userId, createLikeDto: CreateLikeDto) {
    const { postId } = createLikeDto;

    const post = await this.prisma.post.findUnique({ where: { id: postId } })

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const alreadyLiked = await this.prisma.like.findFirst({
      where: {
        user: { id: userId },
        post: { id: postId }
      }
    })

    if (alreadyLiked) {
      throw new ConflictException("You already like this post")
    }

    const data: Prisma.LikeCreateInput = {
      id: uuid(),
      createdAt: new Date(),
      user: {
        connect: { id: userId },
      },
      post: {
        connect: { id: postId },
      }
    };

    await this.prisma.like.create({ data });
  }

  async unlike(userId, unlikePostDto: UnlikeDto) {
    const { postId } = unlikePostDto;

    const like = await this.prisma.like.findFirst({
      where: {
        user: { id: userId },
        post: { id: postId }
      }
    })

    if (!like) {
      throw new NotFoundException("Like not found")
    }

    await this.prisma.like.delete({ where: { id: like.id } });
  }
}
