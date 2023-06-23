import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { CommentService } from 'src/comment/comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid'
import { ReplyLikeDto } from './dto/reply-like.dto';
import { ReplyUnlikeDto } from './dto/reply-unlike.dto';

@Injectable()
export class ReplyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentService: CommentService
  ) { }

  async create(userId, createReplyDto: CreateReplyDto) {
    const { commentId, text } = createReplyDto;

    await this.commentService.findbyid(commentId);

    const data: Prisma.ReplyCreateInput = {
      id: uuid(),
      text,
      user: { connect: { id: userId } },
      comment: { connect: { id: commentId } },
      createdAt: new Date,
    }
    await this.prisma.reply.create({ data })
  }

  async update(userId, updateReply: UpdateReplyDto) {
    const { replyId, text } = updateReply;

    await this.findUserReply(userId, replyId)
    const updatedAt = new Date()
    await this.prisma.reply.update({
      data: { text, updatedAt },
      where: { id: replyId }
    })
  }

  async remove(userId, replyId: string) {
    await this.findUserReply(userId, replyId)

    await this.prisma.reply.delete({ where: { id: replyId } })
  }

  async findReplies(commentId: string, offset: number, limit: number) {
    const replies = await this.prisma.reply.findMany({
      where: {comment: {id: commentId}},
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit
    })
    return replies
  }

  async findUserReply(userId: string, replyId: string){
    const reply = await this.prisma.reply.findFirst({
      where: {
        AND: [
          { id: replyId },
          { userId }
        ]
      }
    })

    if (!reply) {
      throw new NotFoundException('Reply not found')
    }

  }

  async like(userId: string, replyLike: ReplyLikeDto) {
    const { replyId } = replyLike

    const alreadyLiked = await this.prisma.like.findFirst({
      where: {
        user: { id: userId },
        reply: { id: replyId }
      }
    })
    if (alreadyLiked) {      
      throw new ConflictException("You already liked this reply")
    }

    const data: Prisma.LikeCreateInput = {
      id: uuid(),
      reply: { connect: { id: replyId} },
      user: { connect: {id: userId} },
      createdAt: new Date()
    }
    
    await this.prisma.like.create({ data })
  }

  async unlike(userId: string, UnlikeReply: ReplyUnlikeDto) {
    const { replyId } = UnlikeReply
    
    const like = await this.prisma.like.findFirst({
      where: {
        user: { id: userId },
        reply: { id: replyId }
      }
    })

    if (!like){
      throw new NotFoundException("Reply Like not found")
    }
    
    await this.prisma.like.delete({ where: {id: like.id }})
  }

  async findbyid(replyId: string) {
    const replyExists = await this.prisma.reply.findUnique({ where: { id: replyId } })
    if (!replyExists) {
      throw new NotFoundException('Reply not found')
    }
    
  }
}
