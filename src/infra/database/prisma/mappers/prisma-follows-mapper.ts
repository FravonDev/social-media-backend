import { Follow as PrismaFollow, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Follow } from '@/app/entities/follow';

export class PrismaFollowMapper {
  static toDomain(raw: PrismaFollow): Follow {
    return Follow.create(
      {
        followerId: raw.followerId,
        followedId: raw.followedId,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(follow: Follow): Prisma.FollowUncheckedCreateInput {
    return {
      id: follow.id.toString(),
      followerId: follow.followerId,
      followedId: follow.followedId,
      createdAt: follow.createdAt,
    };
  }
}
