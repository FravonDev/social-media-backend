import { Controller, Post, Body, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ReplyLikeService } from './reply-like.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ReplyUnlikeDto } from './dto/reply-unlike.dto';
import { ReplyLikeDto } from './dto/reply-like.dto';

@Controller('reply')
export class ReplyLikeController {
  constructor(private readonly replyLikeService: ReplyLikeService) {}
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Like a reply' })
  @Post('like')
  @HttpCode(HttpStatus.CREATED)
  createLike(@CurrentUser() user: User, @Body() likeCommentDto: ReplyLikeDto ) {
    return this.replyLikeService.like(user.id, likeCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Unlike a reply' })
  @Delete('unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLike(@CurrentUser() user: User, @Body() unlikeReplyDto: ReplyUnlikeDto) {
    return this.replyLikeService.unlike(user.id, unlikeReplyDto);
  }
}
