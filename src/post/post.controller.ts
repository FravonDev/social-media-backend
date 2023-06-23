import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, UsePipes, ValidationPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MissingDataException } from './exceptions/missing-data.exception';
import { DeletePostDto } from './dto/delete-post.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationParams } from './dto/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLikeDto } from './dto/like.dto';
import { UnlikeDto } from './dto/unlike.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Create a post' })
  @Post()
  @HttpCode(201)
  craetePost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    //IMPROVE: make this validation at DTO
    if (!createPostDto.images && !createPostDto.text) {
      throw new MissingDataException()
    }
    return this.postService.create(user.id, createPostDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Update user post' })
  @Patch()
  @HttpCode(204)
  update(@Body() updatePostDto: UpdatePostDto, @CurrentUser() user: User) {
    //IMPROVE: make this validation at DTO
    if (!updatePostDto.images && !updatePostDto.text) {
      throw new MissingDataException()
    }
    return this.postService.update(user.id, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Delete a post' })
  @Delete()
  @HttpCode(204)
  remove(@Body() deletePostDto: DeletePostDto, @CurrentUser() user: User) {
    return this.postService.remove(user.id, deletePostDto.id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get relevant Posts' })
  @Get()
  @HttpCode(200)
  getPosts(@CurrentUser() user: User, @Query() paginationParams: PaginationParams) {
    const { offset, limit } = paginationParams;
    return this.postService.findRelevantPosts(user.id, offset, limit);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Like a post' })
  @Post('like')
  @HttpCode(HttpStatus.CREATED)
  createLike(@CurrentUser() user: User, @Body() createLikeDto: CreateLikeDto) {
    return this.postService.like(user.id, createLikeDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Unlike a post' })
  @Delete('unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeLike(@CurrentUser() user: User, @Body() unlikeDTO: UnlikeDto) {
    return this.postService.unlike(user.id, unlikeDTO);
  }
}
