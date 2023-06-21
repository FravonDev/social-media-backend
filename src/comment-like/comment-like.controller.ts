import { Controller,  Post, Body, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CommentUnlikeDto } from './dto/comment-unlike.dto';
import { CommentLikeDto } from './dto/comment-like.dto';

@Controller('comment')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Like a comment' })
  @Post('like')
  @HttpCode(HttpStatus.CREATED)
  createLike(@CurrentUser() user: User, @Body() likeCommentDto: CommentLikeDto ) {
    return this.commentLikeService.like(user.id, likeCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Unlike a comment' })
  @Delete('unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLike(@CurrentUser() user: User, @Body() unlikeCommentDTO: CommentUnlikeDto) {
    return this.commentLikeService.unlike(user.id, unlikeCommentDTO);
  }
}
