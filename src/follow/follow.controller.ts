import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UnfollowDto } from './dto/unfollow.dto';

@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/follow')
  followUser(@Body() followDto: FollowDto, @CurrentUser() user: User) {    
    return this.followService.follow(followDto, user.username);
  }

  @Post('/unfollow')
  unfollowUser(@Body() unfollowDto: UnfollowDto, @CurrentUser() user: User) {    
    console.log(user.username);
    
    return this.followService.unfollow(unfollowDto, user.id);
  }

  @Get(':username/following')
  following(@Param('username') username: string) {
    return this.followService.findAllFollowing(username);
  }

  @Get(':username/followers')
  followers(@Param('username') username: string) {
    return this.followService.findAllFollowers(username);
  }

}
