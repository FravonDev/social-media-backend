import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FollowsRepository } from '@/app/repositories/follows-repository';
import { Follow } from '@/app/entities/follow';
import { PrismaFollowMapper } from '../mappers/prisma-follows-mapper';

@Injectable()
export class PrismaFollowsRepository implements FollowsRepository {
  constructor(private prisma: PrismaService) {}

  async delete(follow: Follow): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        id: follow.id.toString(),
      },
    });

    return;
  }

  async findByUserIds(
    followerId: string,
    followedId: string,
  ): Promise<Follow | null> {
    const follow = await this.prisma.follow.findFirst({
      where: {
        followerId,
        followedId,
      },
    });
    if (!follow) {
      return null;
    }
    return PrismaFollowMapper.toDomain(follow);
  }

  async create(follow: Follow): Promise<void> {
    const data = PrismaFollowMapper.toPrisma(follow);
    await this.prisma.follow.create({
      data,
    });
  }
}
