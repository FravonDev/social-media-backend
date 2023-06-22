import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid'
import { Post } from './entities/post.entity';
import { CreateLikeDto } from './dto/like.dto';
import { UnlikeDto } from './dto/unlike.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId, createPostDto: CreatePostDto): Promise<Post> {
    const data: Prisma.PostCreateInput = {
      id: uuid(),
      text: createPostDto.text,
      images: createPostDto.images,
      createdAt: new Date(),
      author: {
        connect: { id: userId },
      }
    };

    return await this.prisma.post.create({ data })
  }

  async update(userId, updatePostDto: UpdatePostDto) {
    const { id } = updatePostDto;

    const user = await this.prisma.user.findUnique(
      {
        where: { id: userId },
        include: { Post: true }
      });
    const post = user.Post.find((item) => item.id === id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.post.update({
      data: updatePostDto,
      where: { id }
    })
  }

  async remove(userId, postId: string) {
    const user = await this.prisma.user.findUnique(
      {
        where: { id: userId },
        include: { Post: true }
      });
    const post = user.Post.find((item) => item.id === postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.prisma.post.delete({ where: { id: postId } })
  }
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

  async findById(id: string): Promise<Post> {
    const post = await this.prisma.post.findFirst({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }

  async findRelevantPosts(userId: string, offset: number, limit: number): Promise<Post[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { following: true },
    });

    const followedUserIds = user.following.map((follow) => follow.followedId);

    const posts = await this.prisma.post.findMany({
      where: { authorId: { in: followedUserIds } },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });    

    return posts
  }
}
