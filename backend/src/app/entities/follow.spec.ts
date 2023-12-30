import { Follow, FollowProps } from './follow';
import { randomUUID } from 'node:crypto';

describe('User Entity', () => {
  const initialFolowData: FollowProps = {
    followerId: randomUUID(),
    followedId: randomUUID(),
    createdAt: new Date(),
  };

  it('should create a follow', () => {
    const follow = Follow.create(initialFolowData);

    expect(follow.followerId).toEqual(initialFolowData.followerId);
    expect(follow.followedId).toEqual(initialFolowData.followedId);
    expect(follow.createdAt).toEqual(initialFolowData.createdAt);
  });
});
