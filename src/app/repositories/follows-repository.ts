import { Follow } from '../entities/follow';

export abstract class FollowsRepository {
  abstract findByUserIds(
    followerId: string,
    followingId: string,
  ): Promise<Follow | null>;
  abstract create(follow: Follow): Promise<void>;
}
