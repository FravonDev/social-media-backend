import { Injectable } from '@nestjs/common';
import { GetProfileParamDto } from './dto/get-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(getProfileDto: GetProfileParamDto, userId: string) {
    const { username } = getProfileDto;
    //TODO: get user profile info

    // photo, username, name, bio, username, following count,followers count, posts
    const results = await this.prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        photo: true,
        bio: true,
        followedBy: {
          where: {
            followerId: userId,
          },
        },
        _count: {
          select: {
            following: true,
            followedBy: true,
          },
        },
      },
    });

    if (results) {
      const formattedResponse = {
        id: results.id,
        name: results.name,
        username: results.username,
        photo: results.photo,
        bio: results.bio,
        isFollowedByCurrentUser: results.followedBy.length > 0,
        followingCount: results._count.following,
        followersCount: results._count.followedBy,
      };
      return formattedResponse;
    }
    return null;
  }
}
