import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto) {
    const data: Prisma.PostCreateInput = {
      id: uuid(),
      text: createPostDto.text,
      images: createPostDto.images[0],
      createdAt: new Date(),
      updatedAt: null
    };
    await this.prisma.post.create({
      data: {
        id: data.id,
        createdAt: data.createdAt,
        text: data.text,
        images: data.images
      }
    })
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
