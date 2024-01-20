import { Follow } from '../entities/follow';

export abstract class FollowsRepository {
  abstract findByUserIds(
    followerId: string,
    followedId: string,
  ): Promise<Follow | null>;
  abstract create(follow: Follow): Promise<void>;
  abstract delete(follow: Follow): Promise<void>;
}
