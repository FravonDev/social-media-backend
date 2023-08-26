import { Injectable } from '@nestjs/common';
import { GetProfileParamDto } from './dto/get-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(getProfileDto: GetProfileParamDto) {
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
        _count: {
          select: {
            following: true,
            followedBy: true,
          },
        },
      },
    });
    return results;
  }
}
