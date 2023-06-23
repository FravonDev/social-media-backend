import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ReplyPaginationParams } from './dto/reply-pagination.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { GetReplies } from './dto/get-replies.dto';
import { ReplyLikeDto } from './dto/reply-like.dto';
import { ReplyUnlikeDto } from './dto/reply-unlike.dto';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Reply in a comment' })
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@CurrentUser() user: User, @Body() createReplyDto: CreateReplyDto) {
    return this.replyService.create(user.id, createReplyDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Update reply in a comment' })
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Body() updateReplyDto: UpdateReplyDto,  @CurrentUser() user: User) {
    return this.replyService.update(user.id, updateReplyDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Delete reply in a comment' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() deleteReply: DeleteReplyDto,  @CurrentUser() user: User) {
    return this.replyService.remove(user.id, deleteReply.replyId);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get replies' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @HttpCode(200)
  findReplies(@Body() getReply: GetReplies, @Query() replyPaginationParams: ReplyPaginationParams) {
    const { offset, limit } = replyPaginationParams;

    return this.replyService.findReplies(getReply.commentId, offset, limit);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Like a reply' })
  @Post('like')
  @HttpCode(HttpStatus.CREATED)
  createLike(@CurrentUser() user: User, @Body() likeCommentDto: ReplyLikeDto ) {
    return this.replyService.like(user.id, likeCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Unlike a reply' })
  @Delete('unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLike(@CurrentUser() user: User, @Body() unlikeReplyDto: ReplyUnlikeDto) {
    return this.replyService.unlike(user.id, unlikeReplyDto);
  }

}
