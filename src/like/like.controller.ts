import { Controller, Post, Body, Delete, HttpCode } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/like.dto';
import { UnlikeDto } from './dto/unlike.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Like a post' })
  @Post()
  @HttpCode(201)
  createLike(@CurrentUser() user: User, @Body() createLikeDto: CreateLikeDto) {
    return this.likeService.like(user.id, createLikeDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({ summary: 'Unlike a post' })
  @Delete()
  @HttpCode(204)
  removeLike(@CurrentUser() user: User, @Body() unlikeDTO: UnlikeDto) {
    return this.likeService.unlike(user.id, unlikeDTO);
  }
}