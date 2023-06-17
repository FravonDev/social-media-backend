import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MissingDataException } from './exceptions/missing-data.exception';
import { DeletePostDto } from './dto/delete-post.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationParams } from './dto/pagination.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  craetePost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    //IMPROVE: make this validation at DTO
    if (!createPostDto.images && !createPostDto.text) {
      throw new MissingDataException()
    }
    return this.postService.create(user.id, createPostDto);
  }

  @Patch()
  update(@Body() updatePostDto: UpdatePostDto, @CurrentUser() user: User) {
    //IMPROVE: make this validation at DTO
    if (!updatePostDto.images && !updatePostDto.text) {
      throw new MissingDataException()
    }
    return this.postService.update(user.id, updatePostDto);
  }

  @Delete()
  remove(@Body() deletePostDto: DeletePostDto, @CurrentUser() user: User) {
    return this.postService.remove(user.id, deletePostDto.id);
  }

  @Get()
  getPosts(@CurrentUser() user: User, @Query() paginationParams: PaginationParams) {
    const { offset, limit } = paginationParams;
    return this.postService.findRelevantPosts(user.id, offset, limit);
  }
}
