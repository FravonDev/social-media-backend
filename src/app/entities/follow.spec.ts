import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Follow, FollowProps } from './follow';
import { randomUUID } from 'node:crypto';
describe('User Entity', () => {
  const initialFolowData: FollowProps = {
    followerId: randomUUID(),
    followingId: randomUUID(),
    createdAt: new Date(),
  };

  it('should create a follow', () => {
    const follow = Follow.create(initialFolowData);

    expect(follow.followerId).toEqual(initialFolowData.followerId);
    expect(follow.followingId).toEqual(initialFolowData.followingId);
    expect(follow.createdAt).toEqual(initialFolowData.createdAt);
  });
});
