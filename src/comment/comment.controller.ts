import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetComment } from './dto/get-comment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPaginationParams } from './dto/comment-pagination.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentLikeDto } from './dto/comment-like.dto';
import { CommentUnlikeDto } from './dto/comment-unlike.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Create comment in a post' })
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@CurrentUser() user: User, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(user.id, createCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Update comment in a post' })
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(updateCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Delete comment in a post' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() deleteComment: DeleteCommentDto) {
    return this.commentService.remove(deleteComment.commentId);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get relevant Comments' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @HttpCode(200)  findComments(@Body() getComment: GetComment, @Query() commentPaginationParams: CommentPaginationParams) {
    const { offset, limit } = commentPaginationParams;

    return this.commentService.findRelevantComments(getComment.postId, offset, limit);
  }
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Like a comment' })
  @Post('like')
  @HttpCode(HttpStatus.CREATED)
  createLike(@CurrentUser() user: User, @Body() likeCommentDto: CommentLikeDto ) {
    return this.commentService.like(user.id, likeCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Unlike a comment' })
  @Delete('unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLike(@CurrentUser() user: User, @Body() unlikeCommentDTO: CommentUnlikeDto) {
    return this.commentService.unlike(user.id, unlikeCommentDTO);
  }

}
