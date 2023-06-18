import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetComment } from './dto/get-comment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPaginationParams } from './dto/comment-pagination.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Create comment in a post' })
  @Post()
  create(@CurrentUser() user: User, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(user.id, createCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Delete comment in a post' })
  @HttpCode(204)
  @Patch()
  update(@Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(updateCommentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Delete comment in a post' })
  @HttpCode(204)
  @Delete()
  remove(@Body() deleteComment: DeleteCommentDto) {
    return this.commentService.remove(deleteComment.commentId);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get relevant Posts' })
  @Get()
  @HttpCode(200)  findComments(@Body() getComment: GetComment, @Query() commentPaginationParams: CommentPaginationParams) {
    const { offset, limit } = commentPaginationParams;

    return this.commentService.findRelevantComments(getComment.postId, offset, limit);
  }


}
