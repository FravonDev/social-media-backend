import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReplyLikeDto } from './dto/reply-like.dto';
import { ReplyUnlikeDto } from './dto/reply-unlike.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid'

@Injectable()
export class ReplyLikeService {
  constructor(private readonly prisma: PrismaService) { }

  async like(userId: string, replyLike: ReplyLikeDto) {
    const { replyId } = replyLike

    const alreadyLiked = this.prisma.replyLike.findFirst({
      where: {
        user: { id: userId },
        reply: { id: replyId }
      }
    })
    if (alreadyLiked) {
      throw new ConflictException("You already like this reply")
    }

    const data: Prisma.ReplyLikeCreateInput = {
      id: uuid(),
      reply: { connect: {} },
      user: { connect: {} },
      createdAt: new Date()
    }

    await this.prisma.replyLike.create({ data })
  }

  unlike(userId: string, UnlikeReply: ReplyUnlikeDto) {
    const { replyId } = UnlikeReply
    
    const like = this.prisma.replyLike.findFirst({
      where: {
        user: { id: userId },
        reply: { id: replyId }
      }
    })

    if (!like){
      throw new NotFoundException("Reply Like not found")
    }
  }

}
