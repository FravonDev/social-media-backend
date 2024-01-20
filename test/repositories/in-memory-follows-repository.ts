import { Follow } from '@/domain/app/entities/follow';
import { FollowsRepository } from '@/domain/app/repositories/follows-repository';

export class InMemoryFollowsRepository implements FollowsRepository {
  follows: Follow[] = [];

  async delete(follow: Follow): Promise<void> {
    const index = this.follows.findIndex((item) => item.id === follow.id);
    await this.follows.splice(index, 1);
    return;
  }

  async findByUserIds(
    followerId: string,
    followedId: string,
  ): Promise<Follow | null> {
    const follow = this.follows.find(
      (item) =>
        item.followerId === followerId && item.followedId === followedId,
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
