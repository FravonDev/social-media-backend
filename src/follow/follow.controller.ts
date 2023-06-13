import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UnfollowDto } from './dto/unfollow.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({ summary: 'Follow a user by username' })
  
  @Post('/follow')
  followUser(@Body() followDto: FollowDto, @CurrentUser() user: User) {
    return this.followService.follow(followDto, user.username);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Unfollow a user by username' })
  @Delete('/unfollow')
  unfollowUser(@Body() unfollowDto: UnfollowDto, @CurrentUser() user: User) {
    return this.followService.unfollow(unfollowDto, user.id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get followed list' })
  @Get(':username/following')
  following(@Param('username') username: string) {
    return this.followService.findAllFollowing(username);
  }

  @ApiBearerAuth()
  @Get(':username/followers')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({ summary: 'Get followings list' })
  followers(@Param('username') username: string) {
    return this.followService.findAllFollowers(username);
  }

}
