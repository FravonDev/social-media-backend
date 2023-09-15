import { Follow } from '@/app/entities/follow';
import { FollowsRepository } from '@/app/repositories/follows-repository';

export class InMemoryFollowsRepository implements FollowsRepository {
  follows: Follow[] = [];

  async findByUserIds(
    followerId: string,
    followingId: string,
  ): Promise<Follow | null> {
    const follow = this.follows.find(
      (item) =>
        item.followerId === followerId && item.followingId === followingId,
    );
    if (!follow) {
      return null;
    }
    return follow;
  }

  async create(follow: Follow): Promise<void> {
    await this.follows.push(follow);
  }
}
