import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid'
import { UnfollowDto } from './dto/unfollow.dto';
import { FollowDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) { }

  async follow(createFollowDto: FollowDto, followerUsername: string) {

    const { username } = createFollowDto;

    const userToFollow = await this.findByUsername(username);

    const alreadyFollowing = await this.prisma.follow.findFirst({ where: { followedId: userToFollow.id } })

    if (alreadyFollowing) {
      throw new ConflictException('Already following this user')
    }

    const data: Prisma.FollowCreateInput = {
      id: uuid(),
      followed: { connect: { username: username } },
      follower: { connect: { username: followerUsername } },
      createdAt: new Date()
    };

    await this.prisma.follow.create({ data })
  }
  async findByUsername(username: string) {
    const userExists = await this.userService.findByUsername(username)

    if (!userExists) {
      throw new NotFoundException('User not found')
    }
    return userExists
  }

  async unfollow(unfollowDto: UnfollowDto, userId: string) {
    const { username } = unfollowDto;

    const userToUnfollow = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        following: {
          include: {
            followed: true,
          },
        },
      },
    });

    if (!userToUnfollow) {
      throw new NotFoundException('User not found');
    }

    const followToDelete = userToUnfollow.following.find(follow => follow.followed.username === username);

    if (!followToDelete) {
      throw new NotFoundException('Follow not found');
    }

    await this.prisma.follow.delete({
      where: {
        id: followToDelete.id,
      },
    });
  }

  async findAllFollowers(username: string) {
    await this.findByUsername(username);

    const followers = await this.prisma.follow.findMany({
      where: { followed: { username: username } }
    })
    return followers
  }

  async findAllFollowing(username: string) {
    await this.findByUsername(username);

    const followers = await this.prisma.follow.findMany({
      where: { follower: { username: username } }
    })
    return followers
  }
}
